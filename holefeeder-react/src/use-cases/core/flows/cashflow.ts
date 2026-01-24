import { DateIntervalType } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { TagList } from './tag-list';

export type Cashflow = {
  id: Id;
  effectiveDate: DateOnly;
  amount: Money;
  intervalType: DateIntervalType;
  frequency: number;
  recurrence: number;
  description: string;
  accountId: Id;
  categoryId: Id;
  inactive: boolean;
  tags: TagList;
};

export const CashflowErrors = {
  invalid: 'cashflow-invalid',
};

const create = (
  id: Id,
  effectiveDate: DateOnly,
  amount: Money,
  intervalType: DateIntervalType,
  frequency: number,
  recurrence: number,
  description: string,
  accountId: Id,
  categoryId: Id,
  inactive: boolean = false,
  tags: TagList
): Result<Cashflow> => {
  if (frequency <= 0) return Result.failure([CashflowErrors.invalid]);

  if (recurrence < 0) return Result.failure([CashflowErrors.invalid]);

  return Result.success({
    id: id,
    effectiveDate: effectiveDate,
    amount: amount,
    intervalType: intervalType,
    frequency: frequency,
    recurrence: recurrence,
    description: description,
    accountId: accountId,
    categoryId: categoryId,
    inactive: inactive,
    tags: tags,
  });
};

export const Cashflow = {
  create: create,
};
