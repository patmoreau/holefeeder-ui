import { Account } from '@/core/account';
import { apiService } from '@/services';
import { createListQueryHook } from './use-query';

const accountQueries = createListQueryHook<Account>('accounts', (token) =>
  apiService(token)
    .getAccounts()
    .then((r) => r.data)
);

export const { useList: useAccounts, keys: accountKeys } = accountQueries;
