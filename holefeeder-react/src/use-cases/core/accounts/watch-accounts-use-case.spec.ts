import { waitFor } from '@testing-library/react-native';
import { anAccount } from '@/__tests__/builders/account-for-test';
import { Result } from '@/shared/core/result';
import { Account } from './account';
import { AccountsRepository } from './accounts-repository';
import { WatchAccountsUseCase } from './watch-accounts-use-case';

const createMockRepository = (result: Result<Account[]>): AccountsRepository => ({
  watch: jest.fn((onDataChange) => {
    onDataChange(result);
    return jest.fn(); // Return unsubscribe function
  }),
});

describe('WatchAccountsUseCase', () => {
  it('should return accounts when repository succeeds', async () => {
    const accounts = [anAccount()];
    const repository = createMockRepository(Result.success(accounts));
    const useCase = WatchAccountsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue(accounts);

    unsubscribe();
  });

  it('should return failure when repository fails', async () => {
    const repository = createMockRepository(Result.failure(['error']));
    const useCase = WatchAccountsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeFailureWithErrors(['error']);

    unsubscribe();
  });

  it('should return loading when repository is loading', async () => {
    const repository = createMockRepository(Result.loading());
    const useCase = WatchAccountsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result?.isLoading).toBe(true);

    unsubscribe();
  });

  it('should call repository.watchForCode with correct code', () => {
    const repository = createMockRepository(Result.loading());
    const useCase = WatchAccountsUseCase(repository);

    useCase.query(jest.fn());

    expect(repository.watch).toHaveBeenCalledWith(expect.any(Function));
  });
});
