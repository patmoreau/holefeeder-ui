import { Result } from '@/shared/core/result';
import { Account } from './account';
import { AccountsRepository } from './accounts-repository';

export const WatchAccountsUseCase = (accountsRepository: AccountsRepository) => {
  const query = (onDataChange: (result: Result<Account[]>) => void) => accountsRepository.watch((result) => onDataChange(result));

  return {
    query: query,
  };
};
