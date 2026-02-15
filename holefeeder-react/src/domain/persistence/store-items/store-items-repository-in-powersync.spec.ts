import { waitFor } from '@testing-library/react-native';
import { aWord } from '@/__tests__/mocks/string-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { Result } from '@/domain/core/result';
import { aStoreItem, toStoreItem } from '@/domain/core/store-items/__tests__/store-item-for-test';
import { StoreItemsRepositoryErrors } from '@/domain/core/store-items/store-items-repository';
import { StoreItemsRepositoryInPowersync } from '@/domain/persistence/store-items/store-items-repository-in-powersync';

describe('StoreItemsRepositoryInPowersync', () => {
  let db: DatabaseForTest;

  beforeEach(async () => {
    db = await setupDatabaseForTest();
  });

  afterEach(async () => {
    await db.cleanupTestDb();
  });

  describe('watchForCode', () => {
    it('retrieves a stored store item', async () => {
      const storeItem = await aStoreItem().store(db);
      const repo = StoreItemsRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watchForCode(storeItem.code, (data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue({
        id: storeItem.id,
        code: storeItem.code,
        data: storeItem.data,
      });

      unsubscribe();
    });

    it('returns not found when code does not exist', async () => {
      const repo = StoreItemsRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watchForCode(aWord(), (data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors([StoreItemsRepositoryErrors.storeItemNotFound]);

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = StoreItemsRepositoryInPowersync(db);

      // Close the database to trigger an error
      await db.close();

      let result: Result<any> | undefined;
      const unsubscribe = repo.watchForCode('some-code', (data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors(['The database connection is not open']);

      unsubscribe();
    });
  });

  describe('getByCode', () => {
    it('retrieves a stored store item', async () => {
      const storeItem = await aStoreItem().store(db);
      const repo = StoreItemsRepositoryInPowersync(db);

      const result = await repo.getByCode(storeItem.code);

      expect(result).toBeSuccessWithValue({
        id: storeItem.id,
        code: storeItem.code,
        data: storeItem.data,
      });
    });

    it('returns not found when code does not exist', async () => {
      const repo = StoreItemsRepositoryInPowersync(db);

      const result = await repo.getByCode(aWord());

      expect(result).toBeFailureWithErrors([StoreItemsRepositoryErrors.storeItemNotFound]);
    });

    it('handles database errors', async () => {
      const repo = StoreItemsRepositoryInPowersync(db);

      await db.close();

      const result = await repo.getByCode('some-code');

      expect(result).toBeFailureWithErrors([StoreItemsRepositoryErrors.saveStoreItemFailed]);
    });
  });

  describe('save', () => {
    it('saves a new store item', async () => {
      const storeItem = aStoreItem();
      const repo = StoreItemsRepositoryInPowersync(db);

      const result = await repo.save(toStoreItem(storeItem));

      expect(result).toBeSuccessWithValue(undefined);

      const storedItem = await db.get('SELECT id, code, data FROM store_items WHERE code = ?', [storeItem.code]);
      expect(storedItem).toBeDefined();
      expect(storedItem).toEqual(toStoreItem(storeItem));
    });
  });
});
