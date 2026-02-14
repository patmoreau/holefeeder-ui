import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Account } from '@/domain/core/accounts/account';
import { AccountsRepository } from '@/domain/core/accounts/accounts-repository';
import { Result } from '@/domain/core/result';
import { Variation } from '@/domain/core/variation';

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
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.success([]))
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
