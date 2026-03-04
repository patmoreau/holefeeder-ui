import { waitFor } from '@testing-library/react-native';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { aCategory } from '@/domain/core/categories/__tests__/category-for-test';
import { aCashflow } from '@/domain/core/flows/__tests__/cashflow-for-test';
import { aTransaction } from '@/domain/core/flows/__tests__/transaction-for-test';
import { type AsyncResult } from '@/domain/core/result';
import { DataMetrics } from '@/domain/core/settings/data-metrics';
import { aStoreItem } from '@/domain/core/store-items/__tests__/store-item-for-test';
import { SettingsRepositoryInPowersync } from '@/domain/persistence/settings/settings-repository-in-powersync';

describe('SettingsRepositoryInPowersync', () => {
  let db: DatabaseForTest;

  beforeEach(async () => {
    db = await setupDatabaseForTest();
    await db.execute('CREATE TABLE ps_crud (id INTEGER PRIMARY KEY);');
  });

  afterEach(async () => {
    await db.cleanupTestDb();
  });

  describe('watchDataMetrics', () => {
    it('retrieves data metrics', async () => {
      await anAccount().store(db);
      await aCategory().store(db);
      await aCashflow().store(db);
      await aStoreItem().store(db);
      await aTransaction().store(db);
      await db.execute('INSERT INTO ps_crud (id) VALUES (1);');
      const repo = SettingsRepositoryInPowersync(db);

      let result: AsyncResult<DataMetrics> | undefined;
      const unsubscribe = repo.watchDataMetrics((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue({
        accounts: 1,
        cashflows: 1,
        categories: 1,
        storeItems: 1,
        transactions: 1,
        outstandingTransactions: 1,
      });

      unsubscribe();
    });

    it('returns not found when no data metrics exist', async () => {
      const repo = SettingsRepositoryInPowersync(db);

      let result: AsyncResult<DataMetrics> | undefined;
      const unsubscribe = repo.watchDataMetrics((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue({
        accounts: 0,
        cashflows: 0,
        categories: 0,
        storeItems: 0,
        transactions: 0,
        outstandingTransactions: 0,
      });

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = SettingsRepositoryInPowersync(db);

      // Close the database to trigger an error
      await db.close();

      let result: AsyncResult<DataMetrics> | undefined;
      const unsubscribe = repo.watchDataMetrics((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors(['The database connection is not open']);

      unsubscribe();
    });
  });
});
