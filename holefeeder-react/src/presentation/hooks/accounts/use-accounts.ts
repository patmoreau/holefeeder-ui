import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import type { Account } from '@/domain/core/accounts/account';
import { WatchAccountsUseCase } from '@/domain/core/accounts/watch-accounts/watch-accounts-use-case';
import { Result } from '@/domain/core/result';

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
