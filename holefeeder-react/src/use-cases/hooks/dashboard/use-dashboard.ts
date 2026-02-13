import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Result } from '@/shared/core/result';
import { DashboardComputedSummary, WatchSummaryUseCase } from '@/use-cases/core/dashboard/watch-summary-use-case';
import { DefaultSettings } from '@/use-cases/core/store-items/settings';
import { useSettings } from '../store-items/use-settings';

export const useDashboard = (): Result<DashboardComputedSummary> => {
  const { dashboardRepository } = useRepositories();
  const settingsResult = useSettings();
  const [summary, setSummary] = useState<Result<DashboardComputedSummary>>(Result.loading());

  const settings = Result.isSuccess(settingsResult) ? settingsResult.value : DefaultSettings;

  const useCase = useMemo(() => {
    return WatchSummaryUseCase(settings, dashboardRepository);
  }, [dashboardRepository, settings]);

  useEffect(() => {
    if (!useCase) {
      return;
    }
    const unsubscribe = useCase.query(setSummary);
    return () => unsubscribe();
  }, [useCase]);

  return summary;
};
