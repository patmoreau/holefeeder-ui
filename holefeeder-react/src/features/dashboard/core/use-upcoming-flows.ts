import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { WatchUpcomingFlowsUseCase } from '@/domain/core/flows/watch-upcoming/watch-upcoming-flows-use-case';
import { useSettings } from '@/features/shared/core/use-settings';
import { DefaultSettings } from '@/settings/core/settings';
import { type AsyncResult, Result } from '@/shared/core/result';

export const useUpcomingFlows = (): AsyncResult<UpcomingFlow[]> => {
  const { flowRepository } = useRepositories();
  const settingsResult = useSettings();
  const [upcomingFlows, setUpcomingFlows] = useState<AsyncResult<UpcomingFlow[]>>(Result.loading());

  const useCase = useMemo(() => {
    if (settingsResult.isLoading) return null;

    const settings = settingsResult.isSuccess ? settingsResult.value : DefaultSettings;

    return WatchUpcomingFlowsUseCase(settings, flowRepository);
  }, [flowRepository, settingsResult]);

  useEffect(() => {
    if (!useCase) {
      return;
    }

    const unsubscribe = useCase.watch(setUpcomingFlows);
    return () => unsubscribe();
  }, [useCase]);

  return upcomingFlows;
};
