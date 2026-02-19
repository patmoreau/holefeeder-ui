import { Account } from '@/domain/core/accounts/account';
import { type AsyncResult } from '@/domain/core/result';

export type AccountsRepository = {
  watch: (onDataChange: (result: AsyncResult<Account[]>) => void) => () => void;
};

export const AccountsRepositoryErrors = {
  noAccounts: 'no-accounts',
};
