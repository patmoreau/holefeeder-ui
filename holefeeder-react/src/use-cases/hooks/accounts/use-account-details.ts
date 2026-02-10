import { usePowerSync } from '@powersync/react-native';
import { useEffect, useMemo, useState } from 'react';
import { Result } from '@/shared/core/result';
import { AccountDetail } from '@/use-cases/core/accounts/account-detail';
import { WatchAccountDetailsUseCase } from '@/use-cases/core/accounts/watch-account-details-use-case';
import { AccountsRepositoryInPowersync } from '@/use-cases/persistence/accounts-repository-in-powersync';
import { FlowsRepositoryInPowersync } from '@/use-cases/persistence/flows-repository-in-powersync';

export const useAccountDetails = (): Result<AccountDetail[]> => {
  const db = usePowerSync();
  const [accounts, setAccounts] = useState<Result<AccountDetail[]>>(Result.loading());

  const useCase = useMemo(() => WatchAccountDetailsUseCase(AccountsRepositoryInPowersync(db), FlowsRepositoryInPowersync(db)), [db]);

  useEffect(() => {
    const unsubscribe = useCase.queryDetails(setAccounts);
    return () => unsubscribe();
  }, [useCase]);

  return accounts;
};
