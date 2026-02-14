import { waitFor } from '@testing-library/react-native';
import { aSettings } from '@/domain/core/__tests__/settings-for-test';
import { aStoreItem } from '@/domain/core/__tests__/store-item-for-test';
import { Result } from '@/domain/core/result';
import { StoreItemsRepositoryInMemory } from '@/domain/core/store-items/__tests__/store-items-repository-for-test';
import { DefaultSettings, SETTINGS_CODE } from '@/domain/core/store-items/settings';
import { GetSettingsUseCase } from './get-settings-use-case';

describe('GetSettingsUseCase', () => {
  let repository: StoreItemsRepositoryInMemory;

  beforeEach(() => {
    repository = StoreItemsRepositoryInMemory();
  });

  describe('query', () => {
    it('returns settings', async () => {
      const settings = aSettings();
      const storeItem = aStoreItem({ code: SETTINGS_CODE, data: JSON.stringify(settings) });
      repository.add(storeItem);

      const useCase = GetSettingsUseCase(repository);

      let result: Result<any> | undefined;
      const unsubscribe = useCase.query((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeSuccessWithValue(settings);

      unsubscribe();
    });

    it('returns default settings when code not found', async () => {
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
      repository.isFailing(['error']);
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
      repository.isLoading();
      const useCase = GetSettingsUseCase(repository);

      let result: Result<any> | undefined;
      const unsubscribe = useCase.query((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result?.isLoading).toBe(true);

      unsubscribe();
    });
  });
});
