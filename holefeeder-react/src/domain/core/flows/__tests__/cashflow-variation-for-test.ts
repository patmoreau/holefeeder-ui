import { aPastDate } from '@/__tests__/mocks/date-for-test';
import { aCategoryType, aDateIntervalType } from '@/__tests__/mocks/enum-for-test';
import { aCount, anAmount } from '@/__tests__/mocks/number-for-test';
import { anId } from '@/__tests__/mocks/string-for-test';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';

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
