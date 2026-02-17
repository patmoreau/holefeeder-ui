import { AbstractPowerSyncDatabase } from '@powersync/common';
import { aCategoryType } from '@/__tests__/mocks/enum-for-test';
import { aTagList } from '@/domain/core/__tests__/tag-list-for-test';
import { Transaction } from '@/domain/core/flows/transaction';
import { Money } from '@/domain/core/money';
import { aPastDate } from '../../../../__tests__/mocks/date-for-test';
import { anAmount } from '../../../../__tests__/mocks/number-for-test';
import { anId, aString } from '../../../../__tests__/mocks/string-for-test';

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
  categoryType: aCategoryType(),
  cashflowId: undefined,
  cashflowDate: undefined,
  tags: aTagList(),
});

const times = (count: number, overrides?: Partial<Transaction>): TransactionForTest[] =>
  Array.from({ length: count }, () => aTransaction(overrides));

const store = async (db: AbstractPowerSyncDatabase, transaction: TransactionForTest): Promise<TransactionForTest> => {
  await db.execute(
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

export const aTransaction = (overrides?: Partial<Transaction>): TransactionForTest => {
  const transactionForTest: TransactionForTest = {
    ...defaultTransaction(),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: async (db: AbstractPowerSyncDatabase) => store(db, transactionForTest),
    remove: (db: AbstractPowerSyncDatabase) => remove(db, transactionForTest),
  };
  return transactionForTest;
};

export const toTransaction = ({ times, store, remove, ...transaction }: TransactionForTest): Transaction => transaction;
