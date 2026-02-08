import { Result } from '@/shared/core/result';
import { SummaryData } from '@/use-cases/core/dashboard/summary-data';

export type DashboardRepository = {
  watch: (onDataChange: (result: Result<SummaryData[]>) => void) => () => void;
};
