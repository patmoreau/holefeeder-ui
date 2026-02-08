import { DateOnly } from '@/shared/core/date-only';
import { Money } from '@/shared/core/money';
import { CategoryType } from '@/use-cases/core/categories/category-type';

export type SummaryData = {
  type: CategoryType;
  date: DateOnly;
  total: Money;
};

const valid = (value: Record<string, unknown>): SummaryData => {
  return {
    type: CategoryType.valid(value.type),
    date: DateOnly.valid(value.date as string),
    total: Money.valid(value.total as number),
  };
};

export const SummaryData = {
  valid: valid,
};
