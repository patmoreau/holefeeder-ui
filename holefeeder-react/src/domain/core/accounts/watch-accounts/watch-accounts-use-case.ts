import { type AsyncResult } from '@/domain/core/result';
import { Account } from '../account';
import { AccountsRepository } from '../accounts-repository';

export const WatchAccountsUseCase = (accountsRepository: AccountsRepository) => {
  const query = (onDataChange: (result: AsyncResult<Account[]>) => void) => accountsRepository.watch((result) => onDataChange(result));

  return {
    query: query,
  };
};
