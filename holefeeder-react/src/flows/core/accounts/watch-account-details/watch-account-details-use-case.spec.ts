import { waitFor } from '@testing-library/react-native';
import { anAccount } from '@/flows/core/accounts/__tests__/account-for-test';
import { AccountsRepositoryInMemory } from '@/flows/core/accounts/__tests__/accounts-repository-for-test';
import { AccountSummary } from '@/flows/core/accounts/account-summary';
import { AccountTypes } from '@/flows/core/accounts/account-type';
import { type AsyncResult } from '@/shared/core/result';
import { Variation } from '@/shared/core/variation';
import { WatchAccountDetailsUseCase } from './watch-account-details-use-case';

describe('WatchAccountDetailsUseCase', () => {
  const account = anAccount({ openBalance: Variation.valid(10), type: AccountTypes.checking });
  let accountsRepo: AccountsRepositoryInMemory;
  let useCase: ReturnType<typeof WatchAccountDetailsUseCase>;

  beforeEach(() => {
    accountsRepo = AccountsRepositoryInMemory();
    useCase = WatchAccountDetailsUseCase(accountsRepo);
  });

  describe('watchDetails', () => {
    it('returns account summaries when accounts repository returns data', async () => {
      accountsRepo.add(account);

      let result: AsyncResult<AccountSummary[]> | undefined;
      const unsubscribe = useCase.watchDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeSuccessWithValue([
        {
          id: account.id,
          name: account.name,
          type: account.type,
        },
      ]);

      unsubscribe();
    });

    it('should return failure when accounts repository fails', async () => {
      accountsRepo.isFailing(['error']);

      let result: AsyncResult<AccountSummary[]> | undefined;
      const unsubscribe = useCase.watchDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeFailureWithErrors(['error']);

      unsubscribe();
    });

    it('should return loading when accounts repository is loading', async () => {
      accountsRepo.isLoading();

      let result: AsyncResult<AccountSummary[]> | undefined;
      const unsubscribe = useCase.watchDetails((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeLoading();

      unsubscribe();
    });
  });
});
