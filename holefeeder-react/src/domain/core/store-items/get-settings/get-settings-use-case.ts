import { type AsyncResult, Result } from '@/domain/core/result';
import { DefaultSettings, Settings, SETTINGS_CODE } from '@/domain/core/store-items/settings';
import { StoreItem } from '@/domain/core/store-items/store-item';
import { StoreItemsRepository, StoreItemsRepositoryErrors } from '@/domain/core/store-items/store-items-repository';

export const GetSettingsUseCase = (repository: StoreItemsRepository) => {
  const query = (onDataChange: (result: AsyncResult<Settings>) => void) => {
    return repository.watchForCode(SETTINGS_CODE, (storeItemResult: AsyncResult<StoreItem>) => {
      if (storeItemResult.isLoading) {
        onDataChange(storeItemResult as AsyncResult<Settings>);
        return;
      }

      if (storeItemResult.isFailure) {
        if (storeItemResult.errors.includes(StoreItemsRepositoryErrors.storeItemNotFound)) {
          onDataChange(Result.success(DefaultSettings));
        } else {
          onDataChange(storeItemResult as AsyncResult<Settings>);
        }
        return;
      }

      const storeItem = storeItemResult.value;
      const settingsData = JSON.parse(storeItem.data);
      const settingsResult = Settings.create(settingsData);
      onDataChange(settingsResult);
    });
  };

  return {
    query: query,
  };
};
