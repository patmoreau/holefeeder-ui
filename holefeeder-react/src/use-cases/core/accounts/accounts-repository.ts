import { Result } from '@/shared/core/result';
import { Account } from '@/use-cases/core/accounts/account';

export type AccountsRepository = {
  watch: (onDataChange: (result: Result<Account[]>) => void) => () => void;
};

export const AccountsRepositoryErrors = {
  noAccounts: 'no-accounts',
};
