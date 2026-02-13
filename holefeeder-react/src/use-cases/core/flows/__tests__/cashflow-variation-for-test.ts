import { aPastDate } from '@/__tests__/mocks/date-builder';
import { aCategoryType, aDateIntervalType } from '@/__tests__/mocks/enum-builder';
import { aCount, anAmount } from '@/__tests__/mocks/number-builder';
import { anId } from '@/__tests__/mocks/string-builder';
import { CashflowVariation } from '@/use-cases/core/flows/cashflow-variation';

const defaultCashflowVariation = (): CashflowVariation => ({
  id: anId(),
  accountId: anId(),
  lastPaidDate: aPastDate(),
  lastCashflowDate: aPastDate(),
  amount: anAmount(),
  effectiveDate: aPastDate(),
  frequency: aCount(),
  intervalType: aDateIntervalType(),
  categoryType: aCategoryType(),
});

export const aCashflowVariation = (overrides?: Partial<CashflowVariation>): CashflowVariation => ({
  ...defaultCashflowVariation(),
  ...overrides,
});
