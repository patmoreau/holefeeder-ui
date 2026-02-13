import { DateIntervalType } from '@/shared/core/date-interval-type';
import { Result } from '@/shared/core/result';
import { SummaryData } from './summary-data';

export type DashboardRepository = {
  watch: (onDataChange: (result: Result<SummaryData[]>) => void, intervalType: DateIntervalType, frequency: number) => () => void;
};
