import { type AsyncResult } from '@/domain/core/result';
import { Settings } from '@/domain/core/store-items/settings';
import { SummaryData } from './summary-data';

export type DashboardRepository = {
  watch: (onDataChange: (result: AsyncResult<SummaryData[]>) => void, settings: Settings) => () => void;
};
