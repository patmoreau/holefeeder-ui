import { waitFor } from '@testing-library/react-native';
import { aTag } from '@/__tests__/builders/tag-for-test';
import { aTransaction, toTransaction } from '@/__tests__/builders/transaction-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { aCashflow, toCashflow } from '@/use-cases/core/flows/__tests__/cashflow-for-test';
import { Cashflow } from '@/use-cases/core/flows/cashflow';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { TagList } from '@/use-cases/core/flows/tag-list';
import { Transaction } from '@/use-cases/core/flows/transaction';
import { FlowsRepositoryErrors } from '../core/flows/flows-repository';
import { Tag } from '../core/flows/tag';
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

  xit('should save a transfer as two transactions', async () => {
    // const formData: PurchaseFormData = {
    //   purchaseType: PurchaseType.transfer,
    //   date: '2026-01-23',
    //   amount: 100,
    //   description: 'Transfer to savings',
    //   sourceAccount: { id: 'acc-checking', name: 'Checking' } as any,
    //   targetAccount: { id: 'acc-savings', name: 'Savings' } as any,
    //   category: { id: '', name: '', color: '', icon: '' } as any,
    //   tags: [],
    //   hasCashflow: false,
    //   cashflowEffectiveDate: '',
    //   cashflowIntervalType: 'monthly',
    //   cashflowFrequency: 0,
    // };
    //
    // const result = await repository.create(formData);
    //
    // expect(result.isFailure).toBe(false);
    // if (result.isFailure) return;
    //
    // const transferId = result.value;
    // expect(transferId).toBeDefined();
    //
    // const transactions = await db.getAll<any>('SELECT * FROM transactions WHERE description = ? ORDER BY amount', ['Transfer to savings']);
    //
    // expect(transactions).toHaveLength(2);
    // // Debit
    // expect(transactions[0].amount).toBe(-10000);
    // expect(transactions[0].account_id).toBe('acc-checking');
    // // Credit
    // expect(transactions[1].amount).toBe(10000);
    // expect(transactions[1].account_id).toBe('acc-savings');
  });

  describe('watchCashflows', () => {
    it('retrieves cashflows', async () => {
      const cashflow1 = await aCashflow().store(db);
      const cashflow2 = await aCashflow().store(db);

      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<Cashflow[]> | undefined;
      const unsubscribe = repo.watchCashflows((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([toCashflow(cashflow1), toCashflow(cashflow2)]);

      unsubscribe();
    });

    it('returns empty list when no cashflow exist', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<Cashflow[]> | undefined;
      const unsubscribe = repo.watchCashflows((data) => {
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

      let result: Result<Cashflow[]> | undefined;
      const unsubscribe = repo.watchCashflows((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeFailureWithErrors(['The database connection is not open']);

      unsubscribe();
    });
  });

  describe('watchTransactions', () => {
    it('retrieves transactions', async () => {
      const tx1 = await aTransaction().store(db);
      const tx2 = await aTransaction().store(db);

      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<Transaction[]> | undefined;
      const unsubscribe = repo.watchTransactions((data) => {
        result = data;
      });

      await waitFor(() => {
        expect(result).toBeDefined();
      });

      expect(result).toBeSuccessWithValue([toTransaction(tx1), toTransaction(tx2)]);

      unsubscribe();
    });

    it('returns empty list when no transaction exist', async () => {
      const repo = FlowsRepositoryInPowersync(db);

      let result: Result<Transaction[]> | undefined;
      const unsubscribe = repo.watchTransactions((data) => {
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

      let result: Result<Transaction[]> | undefined;
      const unsubscribe = repo.watchTransactions((data) => {
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

      expect(result).toBeFailureWithErrors([FlowsRepositoryErrors.noTags]);

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
