import { usePowerSync } from '@powersync/react-native';
import { useEffect, useState, useMemo } from 'react';
import { Result } from '@/shared/core/result';
import { WatchAccountsUseCase } from '@/use-cases/core/accounts/watch-accounts-use-case';
import { AccountsRepositoryInPowersync } from '@/use-cases/persistence/accounts-repository-in-powersync';
import type { Account } from '@/use-cases/core/accounts/account';

export const useAccounts = (): Result<Account[]> => {
  const db = usePowerSync();
  const [accounts, setAccounts] = useState<Result<Account[]>>(Result.loading());

  const useCase = useMemo(() => WatchAccountsUseCase(AccountsRepositoryInPowersync(db)), [db]);

  useEffect(() => {
    const unsubscribe = useCase.query(setAccounts);
    return () => unsubscribe();
  }, [useCase]);

  return accounts;
};
