import { waitFor } from '@testing-library/react-native';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { Result } from '@/domain/core/result';
import { AccountsRepositoryInPowersync } from './accounts-repository-in-powersync';

describe('AccountsRepositoryInPowersync', () => {
  let db: DatabaseForTest;

  beforeEach(async () => {
    db = await setupDatabaseForTest();
  });

  afterEach(async () => {
    await db.cleanupTestDb();
  });

  describe('watch', () => {
    it('retrieves a stored account', async () => {
      const account = await anAccount().store(db);
      const repo = AccountsRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watch((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([
        {
          id: account.id,
          type: account.type,
          name: account.name,
          openBalance: account.openBalance,
          openDate: account.openDate,
          description: account.description,
          favorite: account.favorite,
          inactive: account.inactive,
        },
      ]);

      unsubscribe();
    });

    it('returns not found when no accounts exist', async () => {
      const repo = AccountsRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watch((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([]);

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = AccountsRepositoryInPowersync(db);

      // Close the database to trigger an error
      await db.close();

      let result: Result<any> | undefined;
      const unsubscribe = repo.watch((data) => {
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
