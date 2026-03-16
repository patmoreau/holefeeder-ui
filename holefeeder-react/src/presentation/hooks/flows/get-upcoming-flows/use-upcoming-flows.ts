import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { type AsyncResult, Result } from '@/domain/core/result';
import { DefaultSettings } from '@/domain/core/store-items/settings';
import { useSettings } from '@/presentation/hooks/store-items/use-settings';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { WatchUpcomingFlowsUseCase } from '@/domain/core/flows/watch-upcoming/watch-upcoming-flows-use-case';

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
