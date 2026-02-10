import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Result } from '@/shared/core/result';
import { StoreItem } from '@/use-cases/core/store-items/store-item';
import { StoreItemsRepository, StoreItemsRepositoryErrors } from '@/use-cases/core/store-items/store-items-repository';

type StoreItemRow = { id: number; code: string; data: string };

export const StoreItemsRepositoryInPowersync = (db: AbstractPowerSyncDatabase): StoreItemsRepository => {
  const watchForCode = (code: string, onDataChange: (result: Result<StoreItem>) => void) => {
    const query = db.query<StoreItemRow>({
      sql: 'SELECT id, code, data FROM store_items WHERE code = ?',
      parameters: [code],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.failure([StoreItemsRepositoryErrors.storeItemNotFound]))
          : onDataChange(StoreItem.create(data[0])),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  const getByCode = async (code: string): Promise<Result<StoreItem>> => {
    try {
      const existing = await db.getAll<StoreItemRow>('SELECT * FROM store_items WHERE code = ?', [code]);
      if (existing.length > 0) {
        return StoreItem.create(existing[0]);
      } else {
        return Result.failure([StoreItemsRepositoryErrors.storeItemNotFound]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`${StoreItemsRepositoryErrors.saveStoreItemFailed}: `, error.message);
      }
      return Result.failure([StoreItemsRepositoryErrors.saveStoreItemFailed]);
    }
  };

  const save = async (storeItem: StoreItem): Promise<Result<void>> => {
    try {
      const existing = await db.getAll<StoreItemRow>('SELECT * FROM store_items WHERE code = ?', [storeItem.code]);
      if (existing.length > 0) {
        await db.execute('UPDATE store_items SET data = ? WHERE code = ?', [storeItem.data, storeItem.code]);
      } else {
        await db.execute('INSERT INTO store_items (id, code, data) VALUES (?, ?, ?)', [storeItem.id, storeItem.code, storeItem.data]);
      }
      return Result.success();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`${StoreItemsRepositoryErrors.saveStoreItemFailed}: `, error.message);
      }
      return Result.failure([StoreItemsRepositoryErrors.saveStoreItemFailed]);
    }
  };

  return {
    watchForCode: watchForCode,
    getByCode: getByCode,
    save: save,
  };
};
