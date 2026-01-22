import { Account } from '@/features/purchase/core/account';
import { Id } from '@/shared/core/id';
import { usePowerSyncWatchedQuery } from '@/shared/hooks/use-powersync-watched-query';
import { UseQueryResult } from '@/shared/hooks/use-query-result';

type UseAccountsResult = UseQueryResult<Account[]>;

type AccountRow = {
  id: string;
  name: string;
};

export const useAccounts = (): UseAccountsResult => {
  return usePowerSyncWatchedQuery<AccountRow, Account>(
    'purchase-use-accounts',
    `SELECT id, name FROM accounts WHERE inactive = 0 ORDER BY favorite DESC, name`,
    [],
    (row) => ({
      id: Id.valid(row.id),
      name: row.name,
    })
  );
};

export const accountKeys = {
  all: ['accounts'] as const,
};
