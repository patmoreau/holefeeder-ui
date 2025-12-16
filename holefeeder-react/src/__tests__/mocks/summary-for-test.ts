import { anAmount } from '@/__tests__';
import { Summary } from '@/features/dashboard/core/summary';

const defaultSummary = (): Summary => ({
  currentExpenses: anAmount(),
  expenseVariation: anAmount(),
  expenseVariationPercentage: anAmount(),
  netFlow: anAmount(),
  currentGains: anAmount(),
  averageExpenses: anAmount(),
});

export const aSummary = (overrides: Partial<Summary> = {}): Summary => ({ ...defaultSummary(), ...overrides });
