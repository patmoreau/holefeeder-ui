import { dashboardApi } from '@/features/dashboard/api/dashboard-api';
import { Summary } from '@/features/dashboard/core/summary';
import { createSingletonQueryHook } from '@/shared/hooks/queries/use-query';

export type DashboardComputedSummary = {
  raw: Summary;
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

const computeDashboardData = (summary: Summary): DashboardComputedSummary => {
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

const dashboardSummaryQuery = createSingletonQueryHook<Summary>('dashboard', (token) =>
  dashboardApi(token)
    .query()
    .then((res) => res.data)
);

export const { useSingleton: useDashboardSummary, keys: dashboardSummaryKeys } = dashboardSummaryQuery;

export const useDashboardComputedSummary = () => {
  const queryResult = useDashboardSummary();

  const computedData = queryResult.data ? computeDashboardData(queryResult.data) : undefined;

  return {
    ...queryResult,
    summary: computedData,
  };
};
