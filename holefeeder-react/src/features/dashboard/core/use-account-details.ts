import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { AccountDetail } from '@/domain/core/accounts/account-detail';
import { WatchAccountDetailsUseCase } from '@/domain/core/accounts/watch-account-details/watch-account-details-use-case';
import { DateInterval } from '@/domain/core/date-interval';
import { type AsyncResult, Result } from '@/domain/core/result';
import { DefaultSettings } from '@/domain/core/store-items/settings';
import { today } from '@/features/shared/utils/with-date';
import { useSettings } from '@/presentation/hooks/store-items/use-settings';

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
