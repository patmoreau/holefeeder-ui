import { Result } from '@/shared/core/result';
import { Account } from './account';
import { AccountsRepository } from './accounts-repository';

export const WatchAccountsUseCase = (repository: AccountsRepository) => {
  const query = (onDataChange: (result: Result<Account[]>) => void) =>
    repository.watch((result: Result<Account[]>) => {
      if (result.isLoading || result.isFailure) {
        onDataChange(result);
        return;
      }

      onDataChange(result);
    });

  return {
    query: query,
  };
};
