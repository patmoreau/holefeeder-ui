import type { AsyncResult } from '@/domain/core/result';
import { DataMetrics } from '@/domain/core/settings/data-metrics';

export type SettingsRepository = {
  watchDataMetrics: (onDataChange: (result: AsyncResult<DataMetrics>) => void) => () => void;
};
