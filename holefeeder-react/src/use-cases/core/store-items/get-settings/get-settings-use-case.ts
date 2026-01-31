import { Result } from '@/shared/core/result';
import { Settings, SETTINGS_CODE } from '@/use-cases/core/store-items/settings';
import { StoreItem } from '@/use-cases/core/store-items/store-item';
import { StoreItemsRepository } from '@/use-cases/core/store-items/store-items-repository';

export const GetSettingsUseCase = (repository: StoreItemsRepository) => {
  const query = (onDataChange: (result: Result<Settings>) => void) =>
    repository.watchForCode(SETTINGS_CODE, (storeItemResult: Result<StoreItem>) => {
      if (storeItemResult.isLoading || storeItemResult.isFailure) {
        onDataChange(storeItemResult as Result<Settings>);
        return;
      }

      const storeItem = storeItemResult.value;
      const settingsData = JSON.parse(storeItem.data);
      const settingsResult = Settings.create(settingsData);
      onDataChange(settingsResult);
    });

  return {
    query: query,
  };
};
