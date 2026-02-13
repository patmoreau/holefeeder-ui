import { DateIntervalType } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';
import { CategoryType } from '@/use-cases/core/categories/category-type';
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

const schemaPositiveNumber = {
  $id: 'cashflow-positive-number',
  type: 'number',
  minimum: 1,
};

const schemaBoolean = {
  $id: 'cashflow-boolean',
  type: 'boolean',
};

const create = (value: Record<string, unknown>): Result<Cashflow> =>
  Result.combine<Cashflow>({
    id: Id.create(value.id),
    effectiveDate: DateOnly.create(value.effectiveDate),
    amount: Money.create(value.amount),
    intervalType: DateIntervalType.create(value.intervalType),
    frequency: Validate.validateWithErrors(schemaPositiveNumber, value.frequency, [CashflowErrors.invalid]),
    recurrence: Validate.validateWithErrors(schemaPositiveNumber, value.recurrence, [CashflowErrors.invalid]),
    description: Result.success(value.description as string),
    accountId: Id.create(value.accountId),
    categoryId: Id.create(value.categoryId),
    categoryType: CategoryType.create(value.categoryType),
    inactive: Validate.validateWithErrors(schemaBoolean, value.inactive, [CashflowErrors.invalid]),
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
