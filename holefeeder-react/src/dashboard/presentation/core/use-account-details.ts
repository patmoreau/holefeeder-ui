import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { useSettings } from '@/features/shared/core/use-settings';
import { today } from '@/features/shared/utils/with-date';
import { AccountDetail } from '@/flows/core/accounts/account-detail';
import { WatchAccountDetailsUseCase } from '@/flows/core/accounts/watch-account-details/watch-account-details-use-case';
import { DefaultSettings } from '@/settings/core/settings';
import { DateInterval } from '@/shared/core/date-interval';
import { type AsyncResult, Result } from '@/shared/core/result';

export const useAccountDetails = (): AsyncResult<AccountDetail[]> => {
  const { accountRepository, flowRepository } = useRepositories();
  const settingsResult = useSettings();
  const [accounts, setAccounts] = useState<AsyncResult<AccountDetail[]>>(Result.loading());

  const settings = settingsResult.isSuccess ? settingsResult.value : DefaultSettings;

  const dateIntervalResult = useMemo(
    () => DateInterval.createFrom(today(), 0, settings.effectiveDate, settings.intervalType, settings.frequency),
    [settings.effectiveDate, settings.intervalType, settings.frequency]
  );

  const useCase = useMemo(() => {
    if (!dateIntervalResult.isSuccess) {
      return null;
    }
    return WatchAccountDetailsUseCase(dateIntervalResult.value, accountRepository, flowRepository);
  }, [dateIntervalResult, accountRepository, flowRepository]);

  useEffect(() => {
    if (!dateIntervalResult.isSuccess) {
      setAccounts(Result.failure(dateIntervalResult.isFailure ? dateIntervalResult.errors : []));
      return;
    }

    if (!useCase) {
      return;
    }

    const unsubscribe = useCase.watchDetails(setAccounts);
    return () => unsubscribe();
  }, [useCase, dateIntervalResult]);

  return accounts;
};
