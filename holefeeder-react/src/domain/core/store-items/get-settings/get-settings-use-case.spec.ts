import { waitFor } from '@testing-library/react-native';
import { type AsyncResult } from '@/domain/core/result';
import { aSettings } from '@/domain/core/store-items/__tests__/settings-for-test';
import { aStoreItem } from '@/domain/core/store-items/__tests__/store-item-for-test';
import { StoreItemsRepositoryInMemory } from '@/domain/core/store-items/__tests__/store-items-repository-for-test';
import { DefaultSettings, SETTINGS_CODE } from '@/domain/core/store-items/settings';
import { GetSettingsUseCase } from './get-settings-use-case';

describe('GetSettingsUseCase', () => {
  let repository: StoreItemsRepositoryInMemory;
  let useCase: ReturnType<typeof GetSettingsUseCase>;

  beforeEach(() => {
    repository = StoreItemsRepositoryInMemory();
    useCase = GetSettingsUseCase(repository);
  });

  describe('query', () => {
    it('returns settings', async () => {
      const settings = aSettings();
      const storeItem = aStoreItem({ code: SETTINGS_CODE, data: JSON.stringify(settings) });
      repository.add(storeItem);

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.query((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeSuccessWithValue(settings);

      unsubscribe();
    });

    it('returns default settings when code not found', async () => {
      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.query((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeSuccessWithValue(DefaultSettings);

      unsubscribe();
    });

    it('returns failure when repository fails', async () => {
      const storeItem = aStoreItem({ code: SETTINGS_CODE });
      repository.add(storeItem);
      repository.isFailing(['error']);

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.query((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeFailureWithErrors(['error']);

      unsubscribe();
    });

    it('returns loading when repository is loading', async () => {
      const storeItem = aStoreItem({ code: SETTINGS_CODE });
      repository.add(storeItem);
      repository.isLoading();

      let result: AsyncResult<any> | undefined;
      const unsubscribe = useCase.query((data) => {
        result = data;
      });

      await waitFor(() => expect(result).toBeDefined());

      expect(result).toBeLoading();

      unsubscribe();
    });
  });
});
