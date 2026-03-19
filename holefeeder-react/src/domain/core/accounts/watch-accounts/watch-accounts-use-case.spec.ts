import { waitFor } from '@testing-library/react-native';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { AccountsRepositoryInMemory } from '@/domain/core/accounts/__tests__/accounts-repository-for-test';
import { Account } from '@/domain/core/accounts/account';
import { type AsyncResult } from '@/domain/core/result';
import { WatchAccountsUseCase } from './watch-accounts-use-case';

describe('WatchAccountsUseCase', () => {
  let repository: AccountsRepositoryInMemory;
  let useCase: ReturnType<typeof WatchAccountsUseCase>;

  beforeEach(() => {
    repository = AccountsRepositoryInMemory();
    useCase = WatchAccountsUseCase(repository);
  });

  describe('watch', () => {
    it('returns accounts when repository succeeds', async () => {
      const account = anAccount();
      repository.add(account);

      let result: AsyncResult<Account[]> | undefined;
      const unsubscribe = useCase.watch((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeSuccessWithValue([account]);

      unsubscribe();
    });

    it('returns failure when repository fails', async () => {
      repository.isFailing(['error']);

      let result: AsyncResult<Account[]> | undefined;
      const unsubscribe = useCase.watch((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeFailureWithErrors(['error']);

      unsubscribe();
    });

    it('returns loading when repository is loading', async () => {
      repository.isLoading();

      let result: AsyncResult<Account[]> | undefined;
      const unsubscribe = useCase.watch((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeLoading();

      unsubscribe();
    });
  });
});
