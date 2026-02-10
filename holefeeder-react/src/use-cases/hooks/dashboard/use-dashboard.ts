import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Result } from '@/shared/core/result';
import { DashboardComputedSummary, WatchSummaryUseCase } from '@/use-cases/core/dashboard/watch-summary-use-case';
import { useSettings } from '../store-items/use-settings';

export const useDashboard = (): Result<DashboardComputedSummary> => {
  const { dashboardRepository } = useRepositories();
  const settings = useSettings();
  const [summary, setSummary] = useState<Result<DashboardComputedSummary>>(Result.loading());

  const useCase = useMemo(() => {
    if (Result.isSuccess(settings)) {
      return WatchSummaryUseCase(settings.value, dashboardRepository);
    }
    return undefined;
  }, [dashboardRepository, settings]);

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
