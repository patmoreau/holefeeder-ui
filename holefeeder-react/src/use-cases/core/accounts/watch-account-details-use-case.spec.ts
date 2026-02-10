import { waitFor } from '@testing-library/react-native';
import { anAccount } from '@/__tests__/builders/account-for-test';
import { Result } from '@/shared/core/result';
import { FlowsRepository, FlowsRepositoryErrors } from '../flows/flows-repository';
import { Transaction } from '../flows/transaction';
import { Account } from './account';
import { AccountsRepository } from './accounts-repository';
import { WatchAccountDetailsUseCase } from './watch-account-details-use-case';

const createMockAccountsRepository = (result: Result<Account[]>): AccountsRepository => ({
  watch: jest.fn((onDataChange) => {
    onDataChange(result);
    return jest.fn();
  }),
});

const createMockFlowsRepository = (result: Result<Transaction[]>): FlowsRepository => ({
  create: jest.fn(),
  watchTags: jest.fn(),
  watchCashflows: jest.fn(),
  watchTransactions: jest.fn((onDataChange) => {
    onDataChange(result);
    return jest.fn();
  }),
});

describe('WatchAccountDetailsUseCase', () => {
  it('should return account details when both repositories succeed', async () => {
    const accounts = [anAccount()];
    const accountsRepo = createMockAccountsRepository(Result.success(accounts));
    const flowsRepo = createMockFlowsRepository(Result.success([]));
    const useCase = WatchAccountDetailsUseCase(accountsRepo, flowsRepo);

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
    const useCase = WatchAccountDetailsUseCase(accountsRepo, flowsRepo);

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
    const useCase = WatchAccountDetailsUseCase(accountsRepo, flowsRepo);

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
    const flowsRepo = createMockFlowsRepository(Result.failure([FlowsRepositoryErrors.noTags]));
    const useCase = WatchAccountDetailsUseCase(accountsRepo, flowsRepo);

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
    const useCase = WatchAccountDetailsUseCase(accountsRepo, flowsRepo);

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
    const useCase = WatchAccountDetailsUseCase(accountsRepo, flowsRepo);

    useCase.queryDetails(jest.fn());

    expect(accountsRepo.watch).toHaveBeenCalled();
    expect(flowsRepo.watchTransactions).toHaveBeenCalled();
  });
});
