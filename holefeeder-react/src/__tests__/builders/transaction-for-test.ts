import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { AccountForTest, anAccount } from '@/__tests__/builders/account-for-test';
import { aCategory, CategoryForTest } from '@/__tests__/builders/category-for-test';
import { Money } from '@/shared/core/money';
import { aTagList } from '@/use-cases/__tests__/tag-list-for-test';
import { Transaction } from '@/use-cases/core/flows/transaction';
import { aPastDate } from '../mocks/date-builder';
import { anAmount } from '../mocks/number-builder';
import { anId, aString } from '../mocks/string-builder';

export type TransactionForTest = Transaction & {
  times: (count: number) => TransactionForTest[];
  store: (db: AbstractPowerSyncDatabase) => Promise<TransactionForTest>;
  remove: (db: AbstractPowerSyncDatabase) => Promise<void>;
};

const defaultTransaction = (account: AccountForTest, category: CategoryForTest): Transaction => ({
  id: anId(),
  date: aPastDate(),
  amount: anAmount(),
  description: aString(),
  accountId: account.id,
  categoryId: category.id,
  categoryType: category.type,
  cashflowId: anId(),
  cashflowDate: aPastDate(),
  tags: aTagList(),
});

const times = (count: number, overrides?: Partial<Transaction>): TransactionForTest[] =>
  Array.from({ length: count }, () => aTransaction(overrides));

const store = async (db: AbstractPowerSyncDatabase, transaction: TransactionForTest): Promise<TransactionForTest> => {
  const result = await db.execute(
    'INSERT INTO transactions (id, date, amount, description, account_id, category_id, cashflow_id, cashflow_date, tags, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      transaction.id,
      transaction.date,
      Money.toCents(transaction.amount),
      transaction.description,
      transaction.accountId,
      transaction.categoryId,
      transaction.cashflowId,
      transaction.cashflowDate,
      transaction.tags.join(','),
      anId(),
    ]
  );
  return transaction;
};

const remove = async (db: AbstractPowerSyncDatabase, transaction: Transaction): Promise<void> => {
  await db.execute('DELETE FROM transactions WHERE id = ?', [transaction.id]);
};

export const aTransaction = (overrides?: Partial<Transaction>, account?: AccountForTest, category?: CategoryForTest): TransactionForTest => {
  const a = account ?? anAccount();
  const c = category ?? aCategory();
  const transactionForTest: TransactionForTest = {
    ...defaultTransaction(a, c),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: async (db: AbstractPowerSyncDatabase) => {
      await a.store(db);
      await c.store(db);
      return store(db, transactionForTest);
    },
    remove: (db: AbstractPowerSyncDatabase) => remove(db, transactionForTest),
  };
  return transactionForTest;
};

export const toTransaction = ({ times, store, remove, ...transaction }: TransactionForTest): Transaction => transaction;
