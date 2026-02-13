import { startOfToday } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { withDate } from '@/features/shared/utils/with-date';
import { Result } from '@/shared/core/result';
import { AccountDetail } from '@/use-cases/core/accounts/account-detail';
import { WatchAccountDetailsUseCase } from '@/use-cases/core/accounts/watch-account-details-use-case';
import { DateInterval } from '@/use-cases/core/date-interval';
import { DefaultSettings } from '@/use-cases/core/store-items/settings';
import { useSettings } from '@/use-cases/hooks/store-items/use-settings';

export const useAccountDetails = (): Result<AccountDetail[]> => {
  const { accountRepository, flowRepository } = useRepositories();
  const settingsResult = useSettings();
  const [accounts, setAccounts] = useState<Result<AccountDetail[]>>(Result.loading());

  const settings = settingsResult.isSuccess ? settingsResult.value : DefaultSettings;

  const today = withDate(startOfToday()).toDateOnly();
  const dateIntervalResult = useMemo(
    () => DateInterval.createFrom(today, 0, settings.effectiveDate, settings.intervalType, settings.frequency),
    [today, settings.effectiveDate, settings.intervalType, settings.frequency]
  );

  const useCase = useMemo(() => {
    if (!Result.isSuccess(dateIntervalResult)) {
      return null;
    }
    return WatchAccountDetailsUseCase(dateIntervalResult.value, accountRepository, flowRepository);
  }, [dateIntervalResult, accountRepository, flowRepository]);

  useEffect(() => {
    if (!Result.isSuccess(dateIntervalResult)) {
      setAccounts(Result.failure(Result.isFailure(dateIntervalResult) ? dateIntervalResult.errors : []));
      return;
    }

    if (!useCase) {
      return;
    }

    const unsubscribe = useCase.queryDetails(setAccounts);
    return () => unsubscribe();
  }, [useCase, dateIntervalResult]);

  return accounts;
};
