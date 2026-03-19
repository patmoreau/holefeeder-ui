import { CategoryType } from '@/domain/core/categories/category-type';
import { DateOnly } from '@/domain/core/date-only';
import { Money } from '@/domain/core/money';

export type SummaryData = {
  type: CategoryType;
  date: DateOnly;
  total: Money;
};

const valid = (value: Record<string, unknown>): SummaryData => {
  return {
    type: CategoryType.valid(value.type),
    date: DateOnly.valid(value.date),
    total: Money.valid(value.total),
  };
};

export const SummaryData = {
  valid: valid,
};
