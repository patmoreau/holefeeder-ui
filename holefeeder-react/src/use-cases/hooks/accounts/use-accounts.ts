import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Result } from '@/shared/core/result';
import type { Account } from '@/use-cases/core/accounts/account';
import { WatchAccountsUseCase } from '@/use-cases/core/accounts/watch-accounts-use-case';

export const useAccounts = (): Result<Account[]> => {
  const { accountRepository } = useRepositories();
  const [accounts, setAccounts] = useState<Result<Account[]>>(Result.loading());

  const useCase = useMemo(() => WatchAccountsUseCase(accountRepository), [accountRepository]);

  useEffect(() => {
    const unsubscribe = useCase.query(setAccounts);
    return () => unsubscribe();
  }, [useCase]);

  return accounts;
};
