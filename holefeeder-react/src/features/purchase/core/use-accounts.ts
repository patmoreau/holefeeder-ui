import { Account } from '@/core/account';
import { createListQueryHook } from '@/shared/hooks/queries/use-query';
import { apiService } from '@/shared/services/api-service';

const accountQueries = createListQueryHook<Account>('accounts', (token) =>
  apiService(token)
    .getAccounts()
    .then((r) => r.data)
);

export const { useList: useAccounts, keys: accountKeys } = accountQueries;
