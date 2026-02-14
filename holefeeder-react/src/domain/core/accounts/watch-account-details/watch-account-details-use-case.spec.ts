import { waitFor } from '@testing-library/react-native';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { DateOnly } from '@/domain/core/date-only';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { FlowsRepository, FlowsRepositoryErrors } from '@/domain/core/flows/flows-repository';
import { Result } from '@/domain/core/result';
import { Account } from '../account';
import { AccountsRepository } from '../accounts-repository';
import { WatchAccountDetailsUseCase } from './watch-account-details-use-case';

const createMockAccountsRepository = (result: Result<Account[]>): AccountsRepository => ({
  watch: jest.fn((onDataChange) => {
    onDataChange(result);
    return jest.fn();
  }),
});

const createMockFlowsRepository = (
  accountVariations: Result<AccountVariation[]>,
  cashflowVariations: Result<CashflowVariation[]> = Result.success([])
): FlowsRepository => ({
  create: jest.fn(),
  watchTags: jest.fn(() => jest.fn()),
  watchAccountVariations: jest.fn((onDataChange) => {
    onDataChange(accountVariations);
    return jest.fn();
  }),
  watchCashflowVariations: jest.fn((onDataChange) => {
    onDataChange(cashflowVariations);
    return jest.fn();
  }),
});

describe('WatchAccountDetailsUseCase', () => {
  it('should return account details when both repositories succeed', async () => {
    const accounts = [anAccount()];
    const accountsRepo = createMockAccountsRepository(Result.success(accounts));
    const flowsRepo = createMockFlowsRepository(Result.success([]));
    const dateInterval = { start: DateOnly.valid('2023-01-01'), end: DateOnly.valid('2023-12-31') };
    const useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.queryDetails((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result?.isSuccess).toBe(true);
    if (result?.isSuccess) {
      expect(result.value).toHaveLength(1);
    }

    unsubscribe();
  });

  it('should return failure when accounts repository fails', async () => {
    const accountsRepo = createMockAccountsRepository(Result.failure(['error']));
    const flowsRepo = createMockFlowsRepository(Result.success([]));
    const dateInterval = { start: DateOnly.valid('2023-01-01'), end: DateOnly.valid('2023-12-31') };
    const useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.queryDetails((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['error']);

    unsubscribe();
  });

  it('should return failure when flows repository fails with other error', async () => {
    const accountsRepo = createMockAccountsRepository(Result.success([]));
    const flowsRepo = createMockFlowsRepository(Result.failure(['other-error']));
    const dateInterval = { start: DateOnly.valid('2023-01-01'), end: DateOnly.valid('2023-12-31') };
    const useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.queryDetails((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['other-error']);

    unsubscribe();
  });

  it('should return failure when flows repository fails with no-tags error', async () => {
    const accounts = [anAccount()];
    const accountsRepo = createMockAccountsRepository(Result.success(accounts));
    // The previous test case for noTags was probably checking watchTags.
    // WatchAccountDetailsUseCase doesn't use watchTags.
    // However, if watchTransactions (now watchAccountBenchmarks) fails, it should propagate.
    // Let's assume this test meant to check if one of the watchers fails.
    const flowsRepo = createMockFlowsRepository(Result.failure([FlowsRepositoryErrors.noTags]));
    const dateInterval = { start: DateOnly.valid('2023-01-01'), end: DateOnly.valid('2023-12-31') };
    const useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.queryDetails((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors([FlowsRepositoryErrors.noTags]);

    unsubscribe();
  });

  it('should return loading when repository is loading', async () => {
    const accountsRepo = createMockAccountsRepository(Result.loading());
    const flowsRepo = createMockFlowsRepository(Result.success([]));
    const dateInterval = { start: DateOnly.valid('2023-01-01'), end: DateOnly.valid('2023-12-31') };
    const useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.queryDetails((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result?.isLoading).toBe(true);

    unsubscribe();
  });

  it('should call repository.watch and flows.watchTransactions', () => {
    const accountsRepo = createMockAccountsRepository(Result.loading());
    const flowsRepo = createMockFlowsRepository(Result.loading());
    const dateInterval = { start: DateOnly.valid('2023-01-01'), end: DateOnly.valid('2023-12-31') };
    const useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);

    useCase.queryDetails(jest.fn());

    expect(accountsRepo.watch).toHaveBeenCalled();
    expect(flowsRepo.watchAccountVariations).toHaveBeenCalled();
    expect(flowsRepo.watchCashflowVariations).toHaveBeenCalled();
  });
});
