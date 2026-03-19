import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { DashboardComputedSummary, WatchSummaryUseCase } from '@/domain/core/dashboard/watch-summary/watch-summary-use-case';
import { type AsyncResult, Result } from '@/domain/core/result';
import { DefaultSettings } from '@/domain/core/store-items/settings';
import { useSettings } from '../../../features/shared/core/use-settings';

export const useDashboard = (): AsyncResult<DashboardComputedSummary> => {
  const { dashboardRepository } = useRepositories();
  const settingsResult = useSettings();
  const [summary, setSummary] = useState<AsyncResult<DashboardComputedSummary>>(Result.loading());

  const useCase = useMemo(() => {
    if (settingsResult.isLoading) return null;

    const settings = settingsResult.isSuccess ? settingsResult.value : DefaultSettings;

    return WatchSummaryUseCase(settings, dashboardRepository);
  }, [dashboardRepository, settingsResult]);

  useEffect(() => {
    if (!useCase) {
      return;
    }
    const unsubscribe = useCase.query(setSummary);
    return () => unsubscribe();
  }, [useCase]);

  return summary;
};
