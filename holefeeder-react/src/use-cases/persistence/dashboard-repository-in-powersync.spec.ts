import { waitFor } from '@testing-library/react-native';
import { addMonths } from 'date-fns';
import { anAccount } from '@/__tests__/builders/account-for-test';
import { aCategory } from '@/__tests__/builders/category-for-test';
import { aTransaction } from '@/__tests__/builders/transaction-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { withDate } from '@/features/shared/utils/with-date';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { DashboardRepositoryInPowersync } from './dashboard-repository-in-powersync';

describe('DashboardRepositoryInPowersync', () => {
  let db: DatabaseForTest;
  const asOfDate = withDate(new Date(Date.now())).toDateOnly((date) => new Date(date.getFullYear(), date.getMonth(), 1));
  const middleOfMonthDate = withDate(asOfDate).toDateOnly((date) => new Date(date.getFullYear(), date.getMonth(), 10));
  const previousMonthDate = withDate(asOfDate).toDateOnly((date) => addMonths(date, -1));
  const oldestMonthDate = withDate(asOfDate).toDateOnly((date) => addMonths(date, -2));

  beforeEach(async () => {
    db = await setupDatabaseForTest();
  });

  afterEach(async () => {
    await db.cleanupTestDb();
  });

  describe('watch', () => {
    it('retrieves summary data', async () => {
      const creditCardAccount = await anAccount({ type: 'creditCard' }).store(db);
      const checkingAccount = await anAccount({ type: 'checking' }).store(db);
      const purchaseCategory = await aCategory({ name: 'purchase', type: 'expense' }).store(db);
      const foodCategory = await aCategory({ name: 'food and drink', type: 'expense' }).store(db);
      const transferOutCategory = await aCategory({ name: 'transfer out', type: 'expense', system: true }).store(db);
      const transferInCategory = await aCategory({ name: 'transfer in', type: 'gain', system: true }).store(db);
      const incomeCategory = await aCategory({ name: 'income', type: 'gain' }).store(db);
      await aTransaction({
        date: asOfDate,
        accountId: creditCardAccount.id,
        categoryId: purchaseCategory.id,
        amount: Money.valid(500.5),
      }).store(db);
      await aTransaction({
        date: oldestMonthDate,
        accountId: creditCardAccount.id,
        categoryId: foodCategory.id,
        amount: Money.valid(100.1),
      }).store(db);
      await aTransaction({
        date: previousMonthDate,
        accountId: creditCardAccount.id,
        categoryId: foodCategory.id,
        amount: Money.valid(200.2),
      }).store(db);
      await aTransaction({
        date: asOfDate,
        accountId: creditCardAccount.id,
        categoryId: foodCategory.id,
        amount: Money.valid(300.3),
      }).store(db);
      await aTransaction({
        date: asOfDate,
        accountId: creditCardAccount.id,
        categoryId: transferOutCategory.id,
        amount: Money.valid(800.8),
      }).store(db);
      await aTransaction({
        date: middleOfMonthDate,
        accountId: checkingAccount.id,
        categoryId: foodCategory.id,
        amount: Money.valid(400.4),
      }).store(db);
      await aTransaction({
        date: oldestMonthDate,
        accountId: checkingAccount.id,
        categoryId: incomeCategory.id,
        amount: Money.valid(1000.1),
      }).store(db);
      await aTransaction({
        date: previousMonthDate,
        accountId: checkingAccount.id,
        categoryId: incomeCategory.id,
        amount: Money.valid(2000.2),
      }).store(db);
      await aTransaction({
        date: asOfDate,
        accountId: checkingAccount.id,
        categoryId: incomeCategory.id,
        amount: Money.valid(3000.3),
      }).store(db);
      await aTransaction({
        date: asOfDate,
        accountId: checkingAccount.id,
        categoryId: transferInCategory.id,
        amount: Money.valid(7000.7),
      }).store(db);

      const repo = DashboardRepositoryInPowersync(db);

      let result: Result<any> | undefined;
      const unsubscribe = repo.watch((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([
        {
          type: 'expense',
          date: oldestMonthDate,
          total: Money.valid(100.1),
        },
        {
          type: 'expense',
          date: previousMonthDate,
          total: Money.valid(200.2),
        },
        {
          type: 'expense',
          date: asOfDate,
          total: Money.valid(800.8),
        },
        {
          type: 'expense',
          date: middleOfMonthDate,
          total: Money.valid(400.4),
        },
        {
          type: 'gain',
          date: oldestMonthDate,
          total: Money.valid(1000.1),
        },
        {
          type: 'gain',
          date: previousMonthDate,
          total: Money.valid(2000.2),
        },
        {
          type: 'gain',
          date: asOfDate,
          total: Money.valid(3000.3),
        },
      ]);

      unsubscribe();
    });

    it('returns empty list when no transactions exist', async () => {
      const repo = DashboardRepositoryInPowersync(db);

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
      const repo = DashboardRepositoryInPowersync(db);

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
