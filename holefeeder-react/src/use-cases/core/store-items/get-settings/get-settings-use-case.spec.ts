import { waitFor } from '@testing-library/react-native';
import { Result } from '@/shared/core/result';
import { aStoreItem } from '@/use-cases/__tests__/store-item-for-test';
import { DefaultSettings } from '@/use-cases/core/store-items/settings';
import { StoreItem } from '@/use-cases/core/store-items/store-item';
import { StoreItemsRepository } from '@/use-cases/core/store-items/store-items-repository';
import { GetSettingsUseCase } from './get-settings-use-case';

const createMockRepository = (result: Result<StoreItem>): StoreItemsRepository => ({
  watchForCode: jest.fn((code, onDataChange) => {
    onDataChange(result);
    return jest.fn(); // Return unsubscribe function
  }),
});

describe('GetSettingsUseCase', () => {
  it('should return settings when repository succeeds', async () => {
    const storeItem = aStoreItem({ data: JSON.stringify(DefaultSettings) });
    const repository = createMockRepository(Result.success(storeItem));
    const useCase = GetSettingsUseCase(repository);

    let result: Result<any> | undefined;
    const unsubscribe = useCase.query((data) => {
      result = data;
    });

    await waitFor(() => expect(result).toBeDefined());

    expect(result).toBeSuccessWithValue(DefaultSettings);

    unsubscribe();
  });

  it('should return failure when repository fails', async () => {
    const repository = createMockRepository(Result.failure(['error']));
    const useCase = GetSettingsUseCase(repository);

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
    const useCase = GetSettingsUseCase(repository);

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
    const useCase = GetSettingsUseCase(repository);

    useCase.query(jest.fn());

    expect(repository.watchForCode).toHaveBeenCalledWith('settings', expect.any(Function));
  });
});
