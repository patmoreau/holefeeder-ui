import { waitFor } from '@testing-library/react-native';
import { aDateInterval } from '@/domain/core/__tests__/date-interval-for-test';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { anAccountVariation } from '@/domain/core/accounts/__tests__/account-variation-for-test';
import { AccountsRepositoryInMemory } from '@/domain/core/accounts/__tests__/accounts-repository-for-test';
import { AccountTypes } from '@/domain/core/accounts/account-type';
import { CategoryTypes } from '@/domain/core/categories/category-type';
import { DateIntervalTypes } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { aCashflowVariation } from '@/domain/core/flows/__tests__/cashflow-variation-for-test';
import { FlowsRepositoryInMemory } from '@/domain/core/flows/__tests__/flows-repository-in-memory';
import { Money } from '@/domain/core/money';
import { type AsyncResult } from '@/domain/core/result';
import { Variation } from '@/domain/core/variation';
import { WatchAccountDetailsUseCase } from './watch-account-details-use-case';

describe('WatchAccountDetailsUseCase', () => {
  const account = anAccount({ openBalance: Variation.valid(10), type: AccountTypes.checking });
  const accountVariation = anAccountVariation({ accountId: account.id, expenses: Money.valid(111), gains: Money.valid(222) });
  const cashflow = aCashflowVariation({
    accountId: account.id,
    lastPaidDate: DateOnly.valid('2023-01-01'),
    lastCashflowDate: DateOnly.valid('2023-01-01'),
    amount: Money.valid(200),
    effectiveDate: DateOnly.valid('2023-01-01'),
    intervalType: DateIntervalTypes.monthly,
    frequency: 1,
    categoryType: CategoryTypes.expense,
  });
  const dateInterval = aDateInterval({ start: DateOnly.valid('2023-02-01'), end: DateOnly.valid('2023-02-28') });
  let accountsRepo: AccountsRepositoryInMemory;
  let flowsRepo: FlowsRepositoryInMemory;
  let useCase: ReturnType<typeof WatchAccountDetailsUseCase>;

  beforeEach(() => {
    accountsRepo = AccountsRepositoryInMemory();
    flowsRepo = FlowsRepositoryInMemory();
    useCase = WatchAccountDetailsUseCase(dateInterval, accountsRepo, flowsRepo);
  });

  describe('queryDetails', () => {
    it('returns account details when both repositories returns data', async () => {
      accountsRepo.add(account);
      flowsRepo.addAccountVariations(accountVariation);
      flowsRepo.addCashflowVariations(cashflow);

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.queryDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeSuccessWithValue([
        {
          id: account.id,
          name: account.name,
          balance: Money.valid(121),
          lastTransactionDate: accountVariation.lastTransactionDate,
          projectedBalance: Variation.valid(-79),
          upcomingVariation: Variation.valid(-200),
        },
      ]);

      unsubscribe();
    });

    it('should return failure when accounts repository fails', async () => {
      accountsRepo.isFailing(['error']);

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.queryDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeFailureWithErrors(['error']);

      unsubscribe();
    });

    it('should return failure when flows repository fails with other error', async () => {
      flowsRepo.isFailing(['other-error']);

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.queryDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeFailureWithErrors(['other-error', 'other-error']);

      unsubscribe();
    });

    it('should return loading when accounts repository is loading', async () => {
      accountsRepo.isLoading();

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.queryDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeLoading();

      unsubscribe();
    });

    it('should return loading when flows repository is loading', async () => {
      flowsRepo.isLoading();

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.queryDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeLoading();

      unsubscribe();
    });
  });
});
