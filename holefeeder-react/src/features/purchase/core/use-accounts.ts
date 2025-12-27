import { Account } from '@/features/shared/core/account';
import { createListQueryHook } from '@/shared/hooks/queries/use-query';
import { accountApi } from '../api/account-api';

const accountQueries = createListQueryHook<Account>('accounts', (token) =>
  accountApi(token)
    .getAll()
    .then((r) => r.data)
);

export const { useList: useAccounts, keys: accountKeys } = accountQueries;
