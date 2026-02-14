import { DateIntervalType } from '@/domain/core/date-interval-type';
import { Result } from '@/domain/core/result';
import { SummaryData } from './summary-data';

export type DashboardRepository = {
  watch: (onDataChange: (result: Result<SummaryData[]>) => void, intervalType: DateIntervalType, frequency: number) => () => void;
};
