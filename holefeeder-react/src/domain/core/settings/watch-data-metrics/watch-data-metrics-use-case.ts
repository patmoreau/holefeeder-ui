import { type AsyncResult } from '@/domain/core/result';
import { DataMetrics } from '@/domain/core/settings/data-metrics';
import { SettingsRepository } from '@/domain/core/settings/settings-repository';

export const WatchDataMetricsUseCase = (settingsRepository: SettingsRepository) => {
  const query = (onDataChange: (result: AsyncResult<DataMetrics>) => void) =>
    settingsRepository.watchDataMetrics((result) => onDataChange(result));

  return {
    query: query,
  };
};
