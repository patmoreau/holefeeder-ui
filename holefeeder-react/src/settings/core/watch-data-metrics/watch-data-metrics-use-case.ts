import { DataMetrics } from '@/settings/core/data-metrics';
import { SettingsRepository } from '@/settings/core/settings-repository';
import { type AsyncResult } from '@/shared/core/result';

export const WatchDataMetricsUseCase = (settingsRepository: SettingsRepository) => {
  const watch = (onDataChange: (result: AsyncResult<DataMetrics>) => void) =>
    settingsRepository.watchDataMetrics((result) => onDataChange(result));

  return {
    watch: watch,
  };
};
