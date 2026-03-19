import { AbstractPowerSyncDatabase } from '@powersync/common';
import { type AsyncResult, Result } from '@/domain/core/result';
import { StoreItem } from '@/domain/core/store-items/store-item';
import { StoreItemsRepository, StoreItemsRepositoryErrors } from '@/domain/core/store-items/store-items-repository';
import { watchSingle } from '@/domain/persistence/watch-query';

type StoreItemRow = { id: number; code: string; data: string };

export const StoreItemsRepositoryInPowersync = (db: AbstractPowerSyncDatabase): StoreItemsRepository => {
  const watchForCode = (code: string, onDataChange: (result: AsyncResult<StoreItem>) => void) =>
    watchSingle<StoreItemRow, StoreItem>(
      db,
      `SELECT id, code, data FROM store_items WHERE code = ?`,
      [code],
      (row: StoreItemRow) => StoreItem.valid(row),
      onDataChange
    );

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
