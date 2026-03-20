import { Account } from '@/flows/core/accounts/account';
import { type AsyncResult } from '@/shared/core/result';

export type AccountsRepository = {
  watch: (onDataChange: (result: AsyncResult<Account[]>) => void) => () => void;
};

export const AccountsRepositoryErrors = {
  noAccounts: 'no-accounts',
};
