import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { aPastDate } from '@/__tests__/mocks/date-for-test';
import { aCategoryType, aDateIntervalType } from '@/__tests__/mocks/enum-for-test';
import { aCount, anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString } from '@/__tests__/mocks/string-for-test';
import { aTagList } from '@/domain/core/__tests__/tag-list-for-test';
import { AccountForTest } from '@/domain/core/accounts/__tests__/account-for-test';
import { CategoryForTest } from '@/domain/core/categories/__tests__/category-for-test';
import { Cashflow } from '@/domain/core/flows/cashflow';
import { Money } from '@/domain/core/money';

export type CashflowForTest = Cashflow & {
  times: (count: number) => CashflowForTest[];
  store: (db: AbstractPowerSyncDatabase) => Promise<CashflowForTest>;
  remove: (db: AbstractPowerSyncDatabase) => Promise<void>;
};

const defaultCashflow = (): Cashflow => ({
  id: anId(),
  effectiveDate: aPastDate(),
  amount: anAmount(),
  intervalType: aDateIntervalType(),
  frequency: aCount(),
  recurrence: aCount(),
  description: aString(),
  accountId: anId(),
  categoryId: anId(),
  categoryType: aCategoryType(),
  inactive: false,
  tags: aTagList(),
});

const times = (count: number, overrides?: Partial<Cashflow>, account?: AccountForTest, category?: CategoryForTest): CashflowForTest[] =>
  Array.from({ length: count }, () => aCashflow(overrides));

const store = async (db: AbstractPowerSyncDatabase, cashflow: CashflowForTest): Promise<CashflowForTest> => {
  await db.execute(
    'INSERT INTO cashflows (id, effective_date, amount, interval_type, frequency, recurrence, description, account_id, category_id, inactive, tags, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      cashflow.id,
      cashflow.effectiveDate,
      Money.toCents(cashflow.amount),
      cashflow.intervalType,
      cashflow.frequency,
      cashflow.recurrence,
      cashflow.description,
      cashflow.accountId,
      cashflow.categoryId,
      cashflow.inactive ? 1 : 0,
      cashflow.tags.join(','),
      anId(),
    ]
  );
  return cashflow;
};

const remove = async (db: AbstractPowerSyncDatabase, cashflow: Cashflow): Promise<void> => {
  await db.execute('DELETE FROM cashflows WHERE id = ?', [cashflow.id]);
};

export const aCashflow = (overrides?: Partial<Cashflow>): CashflowForTest => {
  const cashflow: CashflowForTest = {
    ...defaultCashflow(),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: async (db: AbstractPowerSyncDatabase) => store(db, cashflow),
    remove: (db: AbstractPowerSyncDatabase) => remove(db, cashflow),
  };
  return cashflow;
};

export const toCashflow = ({ times, store, remove, ...cashflowData }: CashflowForTest): Cashflow => cashflowData;
