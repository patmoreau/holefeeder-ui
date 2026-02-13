import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Result } from '@/shared/core/result';
import { Variation } from '@/shared/core/variation';
import { Account } from '../core/accounts/account';
import { AccountsRepository, AccountsRepositoryErrors } from '../core/accounts/accounts-repository';

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
  const watch = (onDataChange: (result: Result<Account[]>) => void) => {
    const query = db.query<AccountRow>({
      sql: `
        SELECT 
          id, 
          type, 
          name, 
          open_balance as openBalance, 
          open_date as openDate, 
          description, 
          favorite, 
          inactive 
        FROM accounts
        WHERE inactive = 0
        ORDER BY favorite DESC, name ASC
      `,
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.failure([AccountsRepositoryErrors.noAccounts]))
          : onDataChange(
              Result.success(
                data.map((row) =>
                  Account.valid({
                    ...row,
                    openBalance: Variation.fromCents(row.openBalance),
                    favorite: row.favorite === 1,
                    inactive: row.inactive === 1,
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  return {
    watch: watch,
  };
};
