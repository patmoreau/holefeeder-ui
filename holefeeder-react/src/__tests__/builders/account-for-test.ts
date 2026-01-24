import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Account } from '@/shared/core/account';
import { Money } from '@/shared/core/money';
import { aPastDate } from '../mocks/date-builder';
import { anAccountType } from '../mocks/enum-builder';
import { anId, aString } from '../mocks/string-builder';

export type AccountForTest = Account & {
  times: (count: number) => AccountForTest[];
  store: (db: AbstractPowerSyncDatabase) => Promise<AccountForTest>;
  remove: (db: AbstractPowerSyncDatabase) => Promise<void>;
};

const defaultAccount = (): Account => ({
  id: anId(),
  type: anAccountType(),
  name: aString(),
  favorite: false,
  openBalance: Money.ZERO,
  openDate: aPastDate(),
  description: aString(),
  inactive: false,
});

const times = (count: number, overrides?: Partial<Account>): AccountForTest[] => Array.from({ length: count }, () => anAccount(overrides));

const store = async (db: AbstractPowerSyncDatabase, account: AccountForTest): Promise<AccountForTest> => {
  await db.execute(
    'INSERT INTO accounts (id, type, name, favorite, open_balance, open_date, description, inactive, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      account.id,
      account.type,
      account.name,
      account.favorite ? 1 : 0,
      Money.toCents(account.openBalance),
      account.openDate,
      account.description,
      account.inactive ? 1 : 0,
      anId(),
    ]
  );
  return account;
};

const remove = async (db: AbstractPowerSyncDatabase, account: Account): Promise<void> => {
  await db.execute('DELETE FROM accounts WHERE id = ?', [account.id]);
};

export const anAccount = (overrides?: Partial<Account>): AccountForTest => {
  const accountForTest: AccountForTest = {
    ...defaultAccount(),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: (db: AbstractPowerSyncDatabase) => store(db, accountForTest),
    remove: (db: AbstractPowerSyncDatabase) => remove(db, accountForTest),
  };
  return accountForTest;
};
