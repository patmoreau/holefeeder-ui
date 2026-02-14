import { anAmount } from '@/__tests__/mocks/number-for-test';
import { SummaryResult } from '@/domain/core/dashboard/calculate-summary';

const defaultSummary = (): SummaryResult => ({
  currentExpenses: anAmount(),
  expenseVariation: anAmount(),
  expenseVariationPercentage: anAmount(),
  netFlow: anAmount(),
  currentGains: anAmount(),
  averageExpenses: anAmount(),
});

export const aSummary = (overrides: Partial<SummaryResult> = {}): SummaryResult => ({ ...defaultSummary(), ...overrides });
