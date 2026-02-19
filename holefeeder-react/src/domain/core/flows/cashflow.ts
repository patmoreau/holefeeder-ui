import { CategoryType } from '@/domain/core/categories/category-type';
import { DateIntervalType } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { Validate, Validator } from '@/domain/core/validate';
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
  categoryType: CategoryType;
  inactive: boolean;
  tags: TagList;
};

export const CashflowErrors = {
  invalid: 'cashflow-invalid',
  neverPaid: 'cashflow-never-paid',
};

const isPositiveNumber = Validator.numberValidator({ min: 1 });
const isValidBoolean = Validator.booleanValidator();

const create = (value: Record<string, unknown>): Result<Cashflow> =>
  Result.combine<Cashflow>({
    id: Id.create(value.id),
    effectiveDate: DateOnly.create(value.effectiveDate),
    amount: Money.create(value.amount),
    intervalType: DateIntervalType.create(value.intervalType),
    frequency: Validate.validate(isPositiveNumber, value.frequency, [CashflowErrors.invalid]),
    recurrence: Validate.validate(isPositiveNumber, value.recurrence, [CashflowErrors.invalid]),
    description: Result.success(value.description as string),
    accountId: Id.create(value.accountId),
    categoryId: Id.create(value.categoryId),
    categoryType: CategoryType.create(value.categoryType),
    inactive: Validate.validate(isValidBoolean, value.inactive, [CashflowErrors.invalid]),
    tags: TagList.create(value.tags),
  });

const valid = (value: Record<string, unknown>): Cashflow => ({
  id: Id.valid(value.id as string),
  effectiveDate: DateOnly.valid(value.effectiveDate as string),
  amount: Money.valid(value.amount as number),
  intervalType: DateIntervalType.valid(value.intervalType),
  frequency: value.frequency as number,
  recurrence: value.recurrence as number,
  description: value.description as string,
  accountId: Id.valid(value.accountId as string),
  categoryId: Id.valid(value.categoryId as string),
  categoryType: CategoryType.valid(value.categoryType),
  inactive: value.inactive as boolean,
  tags: TagList.valid(value.tags as string[]),
});

export const Cashflow = {
  create: create,
  valid: valid,
};
