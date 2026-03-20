import { AbstractPowerSyncDatabase } from '@powersync/common';
import { Account } from '@/domain/core/accounts/account';
import { AccountsRepository } from '@/domain/core/accounts/accounts-repository';
import { type AsyncResult } from '@/shared/core/result';
import { Variation } from '@/shared/core/variation';
import { watchQuery } from '@/shared/persistence/watch-query';

type AccountRow = {
  id: number;
  type: string;
  name: string;
  openBalance: number;
  openDate: string;
  description: string;
  favorite: number;
  inactive: number;
};

export const AccountsRepositoryInPowersync = (db: AbstractPowerSyncDatabase): AccountsRepository => {
  const watch = (onDataChange: (result: AsyncResult<Account[]>) => void) =>
    watchQuery<AccountRow, Account>(
      db,
      `
        SELECT id,
               type,
               name,
               open_balance as openBalance,
               open_date    as openDate,
               description,
               favorite,
               inactive
        FROM accounts
        WHERE inactive = 0
        ORDER BY favorite DESC, name
      `,
      [],
      (row) =>
        Account.valid({
          ...row,
          openBalance: Variation.fromCents(row.openBalance),
          favorite: row.favorite === 1,
          inactive: row.inactive === 1,
        }),
      onDataChange
    );

  return {
    watch: watch,
  };
};
