import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { aCategoryType } from '@/__tests__/mocks/enum-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { SummaryData } from '@/domain/core/dashboard/summary-data';

const defaultSummaryData = (): SummaryData => ({
  type: aCategoryType(),
  date: aRecentDate(),
  total: anAmount(),
});

export const aSummaryData = (overrides: Partial<SummaryData> = {}): SummaryData => ({ ...defaultSummaryData(), ...overrides });
