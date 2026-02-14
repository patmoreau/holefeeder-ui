import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { anId, aWord } from '@/__tests__/mocks/string-for-test';
import { StoreItem } from '@/domain/core/store-items/store-item';

export type StoreItemForTest = StoreItem & {
  times: (count: number) => StoreItemForTest[];
  store: (db: AbstractPowerSyncDatabase) => Promise<StoreItemForTest>;
  remove: (db: AbstractPowerSyncDatabase) => Promise<void>;
};

const defaultStoreItem = (): StoreItem => ({
  id: anId(),
  code: aWord(),
  data: '{ "amount": 1000, "description": "test" }',
});

const times = (count: number, overrides?: Partial<StoreItem>): StoreItemForTest[] => Array.from({ length: count }, () => aStoreItem(overrides));

const store = async (db: AbstractPowerSyncDatabase, storeItem: StoreItemForTest): Promise<StoreItemForTest> => {
  await db.execute('INSERT INTO store_items (id, code, data, user_id) VALUES (?, ?, ?, ?)', [
    storeItem.id,
    storeItem.code,
    storeItem.data,
    anId(),
  ]);
  return storeItem;
};

const remove = async (db: AbstractPowerSyncDatabase, storeItem: StoreItem): Promise<void> => {
  await db.execute('DELETE FROM store_items WHERE id = ?', [storeItem.id]);
};

export const aStoreItem = (overrides?: Partial<StoreItem>): StoreItemForTest => {
  const storeItemForTest: StoreItemForTest = {
    ...defaultStoreItem(),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: (db: AbstractPowerSyncDatabase) => store(db, storeItemForTest),
    remove: (db: AbstractPowerSyncDatabase) => remove(db, storeItemForTest),
  };
  return storeItemForTest;
};

export const toStoreItem = ({ times, store, remove, ...storeItem }: StoreItemForTest): StoreItem => storeItem;
