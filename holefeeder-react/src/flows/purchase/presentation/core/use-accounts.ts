import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import type { Account } from '@/flows/core/accounts/account';
import { WatchAccountsUseCase } from '@/flows/core/accounts/watch-accounts/watch-accounts-use-case';
import { type AsyncResult, Result } from '@/shared/core/result';

export const useAccounts = (): AsyncResult<Account[]> => {
  const { accountRepository } = useRepositories();
  const [accounts, setAccounts] = useState<AsyncResult<Account[]>>(Result.loading());

  const useCase = useMemo(() => WatchAccountsUseCase(accountRepository), [accountRepository]);

  useEffect(() => {
    const unsubscribe = useCase.watch(setAccounts);
    return () => unsubscribe();
  }, [useCase]);

  return accounts;
};
