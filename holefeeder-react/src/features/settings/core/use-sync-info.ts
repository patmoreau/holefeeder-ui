import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { AsyncResult, Result } from '@/domain/core/result';
import { DataMetrics } from '@/domain/core/settings/data-metrics';
import { WatchDataMetricsUseCase } from '@/domain/core/settings/watch-data-metrics/watch-data-metrics-use-case';
import { SyncInfo } from '@/features/settings/core/sync-info';
import { useSyncStatus } from '@/shared/hooks/use-sync-status';

export const useSyncInfo = (): AsyncResult<SyncInfo> => {
  const { settingsRepository } = useRepositories();
  const { connected, lastSyncedAt, dataFlowStatus } = useSyncStatus();
  const [dataMetrics, setDataMetrics] = useState<AsyncResult<DataMetrics>>(Result.loading());

  const useCase = useMemo(() => WatchDataMetricsUseCase(settingsRepository), [settingsRepository]);

  useEffect(() => {
    const unsubscribe = useCase.watch(setDataMetrics);
    return () => unsubscribe();
  }, [useCase]);

  if (dataMetrics.isLoading) return Result.loading();
  if (dataMetrics.isFailure) return Result.failure(dataMetrics.errors);

  return Result.success<SyncInfo>({
    connected: connected,
    lastSyncedAt: lastSyncedAt ? lastSyncedAt : undefined,
    dataFlowStatus: dataFlowStatus,
    dataMetrics: dataMetrics.value,
  });
};
