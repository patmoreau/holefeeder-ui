import { aCount } from '@/__tests__/mocks/number-for-test';
import { DataMetrics } from '@/settings/core/data-metrics';

const defaultDataMetricsForTest = (): DataMetrics => ({
  accounts: aCount(),
  cashflows: aCount(),
  categories: aCount(),
  storeItems: aCount(),
  transactions: aCount(),
  outstandingTransactions: aCount(),
});

export const aDataMetrics = (overrides?: Partial<DataMetrics>): DataMetrics => ({
  ...defaultDataMetricsForTest(),
  ...overrides,
});
