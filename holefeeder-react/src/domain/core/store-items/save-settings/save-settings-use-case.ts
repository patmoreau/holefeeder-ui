import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';
import { SaveSettingsCommand } from '@/domain/core/store-items/save-settings/save-settings-command';
import { Settings, SETTINGS_CODE } from '@/domain/core/store-items/settings';
import { StoreItem } from '@/domain/core/store-items/store-item';
import { StoreItemsRepository } from '@/domain/core/store-items/store-items-repository';

export const SaveSettingsUseCase = (repository: StoreItemsRepository) => {
  const execute = async (command: SaveSettingsCommand): Promise<Result<void>> => {
    const settingsResult = Settings.create(command);
    if (!settingsResult.isSuccess) {
      return settingsResult;
    }

    const settings = settingsResult.value;
    let storeItem = await repository.getByCode(SETTINGS_CODE);
    if (!storeItem.isSuccess) {
      storeItem = StoreItem.create({
        id: Id.newId(),
        code: SETTINGS_CODE,
        data: JSON.stringify(settings),
      });
    } else {
      storeItem = StoreItem.create({
        id: storeItem.value.id,
        code: SETTINGS_CODE,
        data: JSON.stringify(settings),
      });
    }

    if (storeItem.isSuccess) {
      return await repository.save(storeItem.value);
    }

    return storeItem;
  };

  return {
    execute: execute,
  };
};
