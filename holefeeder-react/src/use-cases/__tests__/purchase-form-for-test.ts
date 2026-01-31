import { aRecentDate } from '@/__tests__/mocks/date-builder';
import { anAmount } from '@/__tests__/mocks/number-builder';
import { anId, aString, aWord } from '@/__tests__/mocks/string-builder';
import { DateIntervalType, DateIntervalTypes } from '@/shared/core/date-interval-type';
import { type PurchaseForm } from '@/use-cases/core/flows/create-flow/create-flow-use-case';

const defaultPurchaseForm = (
  overrides?: Partial<{
    effectiveDate: string;
    intervalType: DateIntervalType;
    frequency: number;
    recurrence: number;
  }>
): PurchaseForm => ({
  date: aRecentDate(),
  amount: anAmount(),
  description: aString(),
  accountId: anId(),
  categoryId: anId(),
  tags: [aWord(), aWord()],
  cashflow: overrides
    ? { effectiveDate: aRecentDate(), intervalType: DateIntervalTypes.monthly, frequency: 1, recurrence: 1, ...overrides }
    : undefined,
});

type PurchaseFormOverrides = Omit<Partial<PurchaseForm>, 'cashflow'> & {
  cashflow?: Partial<NonNullable<PurchaseForm['cashflow']>>;
};

export const aPurchaseForm = (overrides?: PurchaseFormOverrides): PurchaseForm => {
  const { cashflow, ...rest } = overrides || {};
  return {
    ...defaultPurchaseForm(cashflow),
    ...rest,
  };
};
