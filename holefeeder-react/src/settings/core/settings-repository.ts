import { DataMetrics } from '@/settings/core/data-metrics';
import type { AsyncResult } from '@/shared/core/result';

export type SettingsRepository = {
  watchDataMetrics: (onDataChange: (result: AsyncResult<DataMetrics>) => void) => () => void;
};
