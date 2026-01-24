import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { TagList } from '@/use-cases/core/flows/tag-list';
import { flowsRepositoryInPowersync } from './flows-repository-in-powersync';

describe('FlowsRepository', () => {
  let db: DatabaseForTest;
  let repository: ReturnType<typeof flowsRepositoryInPowersync>;

  beforeEach(async () => {
    db = await setupDatabaseForTest();
    repository = flowsRepositoryInPowersync(db);
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

    expect(result.isFailure).toBe(false);
    if (result.isFailure) return;

    const transaction = result.value;
    expect(transaction.id).toBeDefined();

    const dbResult = await db.getAll<any>('SELECT * FROM transactions WHERE id = ?', [transaction.id]);

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
});
