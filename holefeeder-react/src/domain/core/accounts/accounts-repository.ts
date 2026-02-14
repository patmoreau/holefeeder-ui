import { Account } from '@/domain/core/accounts/account';
import { Result } from '@/domain/core/result';

export type AccountsRepository = {
  watch: (onDataChange: (result: Result<Account[]>) => void) => () => void;
};

export const AccountsRepositoryErrors = {
  noAccounts: 'no-accounts',
};
