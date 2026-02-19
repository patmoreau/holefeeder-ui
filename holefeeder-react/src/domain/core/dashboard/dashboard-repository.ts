import { DateIntervalType } from '@/domain/core/date-interval-type';
import { type AsyncResult } from '@/domain/core/result';
import { SummaryData } from './summary-data';

export type DashboardRepository = {
  watch: (onDataChange: (result: AsyncResult<SummaryData[]>) => void, intervalType: DateIntervalType, frequency: number) => () => void;
};
