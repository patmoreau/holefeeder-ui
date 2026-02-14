import { DateIntervalType } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { TagList } from '@/domain/core/flows/tag-list';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { Validate } from '@/domain/core/validate';

export type CreateFlowCommand = {
  date: DateOnly;
  amount: Money;
  description: string;
  accountId: Id;
  categoryId: Id;
  tags: TagList;
  cashflow?: { effectiveDate: DateOnly; intervalType: DateIntervalType; frequency: number; recurrence: number };
};

export const CreateFlowErrors = {
  invalidCashflowFrequency: 'invalid-cashflow-frequency',
};

const schema = {
  $id: 'frequency',
  type: 'number',
  minimum: 1,
};

const create = (purchase: Record<string, unknown>): Result<CreateFlowCommand> =>
  Result.combine<CreateFlowCommand>({
    date: DateOnly.create(purchase.date),
    amount: Money.create(purchase.amount),
    description: Result.success(purchase.description as string),
    accountId: Id.create(purchase.accountId),
    categoryId: Id.create(purchase.categoryId),
    tags: TagList.create(purchase.tags),
    cashflow: createCashflow(purchase.cashflow as Record<string, unknown>),
  });

const createCashflow = (cashflow?: Record<string, unknown>): Result<CreateFlowCommand['cashflow']> => {
  if (!cashflow) return Result.success(undefined);

  type CashflowObject = NonNullable<CreateFlowCommand['cashflow']>;

  return Result.combine<CashflowObject>({
    effectiveDate: DateOnly.create(cashflow.effectiveDate),
    intervalType: Result.success(cashflow.intervalType as DateIntervalType),
    frequency: Validate.validateWithErrors(schema, cashflow.frequency, [CreateFlowErrors.invalidCashflowFrequency]),
    recurrence: Result.success(cashflow.recurrence as number),
  });
};

export const CreateFlowCommand = {
  create: create,
};
