import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Transaction } from '@/core/transaction';
import { Money } from '@/shared/core/money';
import { aPastDate } from '../mocks/date-builder';
import { anAmount } from '../mocks/number-builder';
import { anId, aString } from '../mocks/string-builder';

export type TransactionForTest = Transaction & {
  times: (count: number) => TransactionForTest[];
  store: (db: AbstractPowerSyncDatabase) => Promise<TransactionForTest>;
  remove: (db: AbstractPowerSyncDatabase) => Promise<void>;
};

const defaultTransaction = (): Transaction => ({
  id: anId(),
  date: aPastDate(),
  amount: anAmount(),
  description: aString(),
  accountId: anId(),
  categoryId: anId(),
  cashflowId: anId(),
  cashflowDate: aPastDate(),
  tags: [],
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
  console.log('Transaction stored:', result);
  return transaction;
};

const remove = async (db: AbstractPowerSyncDatabase, transaction: Transaction): Promise<void> => {
  await db.execute('DELETE FROM transactions WHERE id = ?', [transaction.id]);
};

export const aTransaction = (overrides?: Partial<Transaction>): TransactionForTest => {
  const transactionForTest: TransactionForTest = {
    ...defaultTransaction(),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: (db: AbstractPowerSyncDatabase) => store(db, transactionForTest),
    remove: (db: AbstractPowerSyncDatabase) => remove(db, transactionForTest),
  };
  return transactionForTest;
};

export const toTransaction = ({ times, store, remove, ...transaction }: TransactionForTest): Transaction => transaction;
