import { aPastDate } from '@/__tests__/mocks/date-for-test';
import { aCategoryType, aDateIntervalType } from '@/__tests__/mocks/enum-for-test';
import { aCount, anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString } from '@/__tests__/mocks/string-for-test';
import { aTagList } from '@/domain/core/__tests__/tag-list-for-test';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';

const defaultCashflowVariation = (): CashflowVariation => ({
  id: anId(),
  accountId: anId(),
  lastPaidDate: aPastDate(),
  lastCashflowDate: aPastDate(),
  amount: anAmount(),
  description: aString(),
  effectiveDate: aPastDate(),
  frequency: aCount(),
  intervalType: aDateIntervalType(),
  categoryType: aCategoryType(),
  tags: aTagList(),
});

export const aCashflowVariation = (overrides?: Partial<CashflowVariation>): CashflowVariation => ({
  ...defaultCashflowVariation(),
  ...overrides,
});
