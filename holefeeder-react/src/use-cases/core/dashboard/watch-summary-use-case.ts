import { withDate } from '@/features/shared/utils/with-date';
import { Result } from '@/shared/core/result';
import { DateInterval } from '../date-interval';
import { Settings } from '../store-items/settings';
import { calculateSummary, SummaryResult } from './calculate-summary';
import { DashboardRepository } from './dashboard-repository';
import { SummaryData } from './summary-data';

export const WatchSummaryUseCase = (settings: Settings, repository: DashboardRepository) => {
  const query = (onDataChange: (result: Result<DashboardComputedSummary>) => void) =>
    repository.watch((result: Result<SummaryData[]>) => {
      if (result.isLoading || result.isFailure) {
        onDataChange(result);
        return;
      }

      const dateIntervalResult = DateInterval.createFrom(
        withDate(new Date(Date.now())).toDateOnly(),
        0,
        settings.effectiveDate,
        settings.intervalType,
        settings.frequency
      );
      if (!Result.isSuccess(dateIntervalResult)) {
        onDataChange(dateIntervalResult);
        return;
      }

      const summaryResult = calculateSummary(result.value, dateIntervalResult.value.start, settings.intervalType, settings.frequency);
      const computedSummary = computeDashboardData(summaryResult);

      onDataChange(Result.success(computedSummary));
    });

  return {
    query: query,
  };
};

export type DashboardComputedSummary = {
  raw: SummaryResult;
  currentSpending: number;
  variation: {
    amount: number;
    percentage: number;
    isOver: boolean;
  };
  netFlow: {
    amount: number;
    isOver: boolean;
  };
  totalIncome: number;
  averageSpending: number;
};

const computeDashboardData = (summary: SummaryResult): DashboardComputedSummary => {
  const isOver = summary.expenseVariation > 0;

  return {
    raw: summary,
    currentSpending: summary.currentExpenses,
    variation: {
      amount: Math.abs(summary.expenseVariation),
      percentage: Math.abs(summary.expenseVariationPercentage),
      isOver,
    },
    netFlow: {
      amount: Math.abs(summary.netFlow),
      isOver: summary.netFlow > 0,
    },
    totalIncome: summary.currentGains,
    averageSpending: summary.averageExpenses,
  };
};
