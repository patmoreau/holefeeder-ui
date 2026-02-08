import { usePowerSync } from '@powersync/react-native';
import { useEffect, useState, useMemo } from 'react';
import { Result } from '@/shared/core/result';
import { DashboardComputedSummary, WatchSummaryUseCase } from '@/use-cases/core/dashboard/watch-summary-use-case';
import { DashboardRepositoryInPowersync } from '@/use-cases/persistence/dashboard-repository-in-powersync';
import { useSettings } from '../store-items/use-settings';

export const useDashboard = (): Result<DashboardComputedSummary> => {
  const db = usePowerSync();
  const settings = useSettings();
  const [summary, setSummary] = useState<Result<DashboardComputedSummary>>(Result.loading());

  const useCase = useMemo(() => {
    if (Result.isSuccess(settings)) {
      return WatchSummaryUseCase(settings.value, DashboardRepositoryInPowersync(db));
    }
    return undefined;
  }, [db, settings]);

  useEffect(() => {
    if (!useCase) {
      return;
    }
    const unsubscribe = useCase.query(setSummary);
    return () => unsubscribe();
  }, [useCase]);

  if (Result.isLoading(settings)) {
    return Result.loading();
  }

  if (Result.isFailure(settings)) {
    return Result.failure(settings.errors);
  }

  return summary;
};
