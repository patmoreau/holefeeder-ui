import { waitFor } from '@testing-library/react-native';
import { aCategory } from '@/__tests__/builders/category-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { Result } from '@/shared/core/result';
import { CategoriesRepositoryErrors } from '../core/categories/categories-repository';
import { CategoriesRepositoryInPowersync } from './categories-repository-in-powersync';

describe('CategoriesRepositoryInPowersync', () => {
  let db: DatabaseForTest;

  beforeEach(async () => {
    db = await setupDatabaseForTest();
  });

  afterEach(async () => {
    await db.cleanupTestDb();
  });

  describe('watch', () => {
    it('retrieves a stored category', async () => {
      const category = await aCategory().store(db);
      const repo = CategoriesRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watch((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([
        {
          id: category.id,
          type: category.type,
          name: category.name,
          color: category.color,
          budgetAmount: category.budgetAmount,
          favorite: category.favorite,
          system: category.system,
        },
      ]);

      unsubscribe();
    });

    it('returns not found when no categories exist', async () => {
      const repo = CategoriesRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watch((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors([CategoriesRepositoryErrors.noCategories]);

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = CategoriesRepositoryInPowersync(db);

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
