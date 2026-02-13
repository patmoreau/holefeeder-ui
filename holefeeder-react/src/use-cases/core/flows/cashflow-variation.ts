import { DateIntervalType } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { Variation } from '@/shared/core/variation';
import { CategoryType } from '../categories/category-type';

export type CashflowVariation = {
  id: Id;
  accountId: Id;
  lastPaidDate?: DateOnly;
  lastCashflowDate?: DateOnly;
  amount: Money;
  effectiveDate: DateOnly;
  frequency: number;
  intervalType: DateIntervalType;
  categoryType: CategoryType;
};

export const CashflowVariationErrors = {
  neverPaid: 'cashflow-never-paid',
};

const valid = (value: Record<string, unknown>) => ({
  accountId: Id.valid(value.accountId as string),
  cashflowId: Id.valid(value.cashflowId as string),
  lastPaidDate: value.lastPaidDate ? DateOnly.valid(value.lastPaidDate as string) : undefined,
  lastCashflowDate: value.lastCashflowDate ? DateOnly.valid(value.lastCashflowDate as string) : undefined,
  amount: Money.valid(value.amount as number),
  effectiveDate: DateOnly.valid(value.effectiveDate as string),
  frequency: value.frequency as number,
  intervalType: DateIntervalType.valid(value.intervalType as string),
  categoryType: CategoryType.valid(value.categoryType as string),
});

const forVariations = (cashflow: CashflowVariation) => {
  const lastPaidDate = (): Result<DateOnly | undefined> => {
    if (!cashflow.lastPaidDate) return Result.failure([CashflowVariationErrors.neverPaid]);
    return Result.success(cashflow.lastPaidDate);
  };

  const lastCashflowDate = (): Result<DateOnly | undefined> => {
    if (!cashflow.lastCashflowDate) return Result.failure([CashflowVariationErrors.neverPaid]);
    return Result.success(cashflow.lastCashflowDate);
  };

  const isNotPaid = (nextDate: DateOnly): boolean => {
    // If never paid, then any date >= effectiveDate is unpaid
    if (!cashflow || !cashflow.lastPaidDate || !cashflow.lastCashflowDate) {
      return nextDate >= cashflow.effectiveDate;
    }

    return nextDate > cashflow.lastPaidDate && nextDate > cashflow.lastCashflowDate;
  };

  const getUpcomingDates = (toDate: DateOnly): DateOnly[] => {
    const dates = DateIntervalType.datesInRange(
      cashflow.effectiveDate,
      cashflow.effectiveDate,
      toDate,
      cashflow.frequency,
      cashflow.intervalType
    );
    return dates.filter((futureDate) => isNotPaid(futureDate));
  };

  const calculateUpcomingVariation = (toDate: DateOnly): Variation => {
    const upcomingDates = getUpcomingDates(toDate);

    return Variation.multiply(
      Variation.multiply(Variation.valid(cashflow.amount), CategoryType.multiplier[cashflow.categoryType]),
      upcomingDates.length
    );
  };

  return {
    lastPaidDate: lastPaidDate,
    lastCashflowDate: lastCashflowDate,
    isNotPaid: isNotPaid,
    getUpcomingDates: getUpcomingDates,
    calculateUpcomingVariation: calculateUpcomingVariation,
  };
};

export const CashflowVariation = {
  valid: valid,
  forVariation: forVariations,
};
