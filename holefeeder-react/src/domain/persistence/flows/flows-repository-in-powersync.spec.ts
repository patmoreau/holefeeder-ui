import { waitFor } from '@testing-library/react-native';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { aCategory } from '@/domain/core/categories/__tests__/category-for-test';
import { CategoryTypes } from '@/domain/core/categories/category-type';
import { DateOnly } from '@/domain/core/date-only';
import { aCashflow } from '@/domain/core/flows/__tests__/cashflow-for-test';
import { aTag } from '@/domain/core/flows/__tests__/tag-for-test';
import { aTransaction } from '@/domain/core/flows/__tests__/transaction-for-test';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { Tag } from '@/domain/core/flows/tag';
import { TagList } from '@/domain/core/flows/tag-list';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { FlowsRepositoryInPowersync } from './flows-repository-in-powersync';

describe('FlowsRepository', () => {
  let db: DatabaseForTest;
  let repository: ReturnType<typeof FlowsRepositoryInPowersync>;

  beforeEach(async () => {
    db = await setupDatabaseForTest();
    repository = FlowsRepositoryInPowersync(db);
  });

  afterEach(async () => {
    await db.cleanupTestDb();
  });

  describe('create', () => {
    it('should save a purchase transaction', async () => {
      const purchase: CreateFlowCommand = {
        date: DateOnly.valid('2026-01-23'),
        amount: Money.valid(50.25),
        description: 'Groceries',
        accountId: Id.valid('acc-123'),
        categoryId: Id.valid('cat-456'),
        tags: TagList.valid(['tag-1']),
      };

      const result = await repository.create(purchase);

      expect(result.isSuccess).toBe(true);

      if (result.isFailure || result.isLoading) return;

      const dbResult = await db.getAll<any>('SELECT * FROM transactions WHERE id = ?', [result.value]);

      expect(dbResult).toHaveLength(1);
      expect(dbResult[0].amount).toBe(5025); // 50.25 * 100
      expect(dbResult[0].description).toBe('Groceries');
      expect(dbResult[0].tags).toBe('tag-1');
    });
  });

  describe('watchAccountVariations', () => {
    it('retrieves account variations', async () => {
      const account = await anAccount().store(db);
      const expense = await aCategory({ type: CategoryTypes.expense }).store(db);
      const gains = await aCategory({ type: CategoryTypes.gain }).store(db);
      await aTransaction({
        accountId: account.id,
        categoryId: expense.id,
        amount: Money.valid(123.45),
        date: DateOnly.valid('2026-02-12'),
      }).store(db);
      await aTransaction({
        accountId: account.id,
        categoryId: gains.id,
        amount: Money.valid(1000.0),
        date: DateOnly.valid('2026-02-01'),
      }).store(db);

      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<AccountVariation[]> | undefined;
      const unsubscribe = repo.watchAccountVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([
        {
          accountId: account.id,
          gains: Money.valid(1000.0),
          expenses: Money.valid(123.45),
          lastTransactionDate: DateOnly.valid('2026-02-12'),
        },
      ]);

      unsubscribe();
    });

    it('returns empty list when no transaction exist', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<AccountVariation[]> | undefined;
      const unsubscribe = repo.watchAccountVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([]);

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      // Close the database to trigger an error
      await db.close();

      let result: Result<AccountVariation[]> | undefined;
      const unsubscribe = repo.watchAccountVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors(['The database connection is not open']);

      unsubscribe();
    });
  });

  describe('watchCashflows', () => {
    it('retrieves cashflows never paid', async () => {
      const category = await aCategory({ type: CategoryTypes.expense }).store(db);
      const cashflow = await aCashflow({ categoryId: category.id, amount: Money.valid(100) }).store(db);

      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<CashflowVariation[]> | undefined;
      const unsubscribe = repo.watchCashflowVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([
        {
          id: cashflow.id,
          accountId: cashflow.accountId,
          categoryType: category.type,
          amount: Money.valid(100),
          effectiveDate: cashflow.effectiveDate,
          frequency: cashflow.frequency,
          intervalType: cashflow.intervalType,
          lastPaidDate: undefined,
          lastCashflowDate: undefined,
        },
      ]);

      unsubscribe();
    });

    it('retrieves cashflows paid', async () => {
      const category = await aCategory({ type: CategoryTypes.expense }).store(db);
      const cashflow = await aCashflow({ categoryId: category.id, amount: Money.valid(100) }).store(db);
      const transaction = await aTransaction({
        accountId: cashflow.accountId,
        categoryId: cashflow.categoryId,
        amount: Money.valid(100),
        cashflowDate: DateOnly.valid('2025-12-31'),
        cashflowId: cashflow.id,
      }).store(db);

      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<CashflowVariation[]> | undefined;
      const unsubscribe = repo.watchCashflowVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([
        {
          id: cashflow.id,
          accountId: cashflow.accountId,
          categoryType: category.type,
          amount: Money.valid(100),
          effectiveDate: cashflow.effectiveDate,
          frequency: cashflow.frequency,
          intervalType: cashflow.intervalType,
          lastPaidDate: transaction.date,
          lastCashflowDate: transaction.cashflowDate,
        },
      ]);

      unsubscribe();
    });

    it('returns empty list when no cashflow exist', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<CashflowVariation[]> | undefined;
      const unsubscribe = repo.watchCashflowVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([]);

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      // Close the database to trigger an error
      await db.close();

      let result: Result<CashflowVariation[]> | undefined;
      const unsubscribe = repo.watchCashflowVariations((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors(['The database connection is not open']);

      unsubscribe();
    });
  });

  describe('watchTags', () => {
    it('retrieves transaction tags', async () => {
      await aTransaction({ tags: TagList.valid(['groceries', 'food']) }).store(db);
      await aTransaction({ tags: TagList.valid(['groceries', 'shopping']) }).store(db);
      await aTransaction({ tags: TagList.valid(['food']) }).store(db);
      const validTags: Tag[] = [aTag({ tag: 'food', count: 2 }), aTag({ tag: 'groceries', count: 2 }), aTag({ tag: 'shopping', count: 1 })];

      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<Tag[]> | undefined;
      const unsubscribe = repo.watchTags((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue(validTags);

      unsubscribe();
    });

    it('returns not found when no tags exist', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<Tag[]> | undefined;
      const unsubscribe = repo.watchTags((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([]);

      unsubscribe();
    });

    it('handles database errors', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      // Close the database to trigger an error
      await db.close();

      let result: Result<Tag[]> | undefined;
      const unsubscribe = repo.watchTags((data) => {
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
