import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';

export type PayFlowCommand = {
  date: DateOnly;
  amount: Money;
  cashflowId: Id;
  cashflowDate: DateOnly;
};

const create = (pay: Record<string, unknown>): Result<PayFlowCommand> =>
  Result.combine<PayFlowCommand>({
    date: DateOnly.create(pay.date),
    amount: Money.create(pay.amount),
    cashflowId: Id.create(pay.cashflowId),
    cashflowDate: DateOnly.create(pay.cashflowDate),
  });

const valid = (pay: Record<string, unknown>): PayFlowCommand => ({
  date: DateOnly.valid(pay.date as string),
  amount: Money.valid(pay.amount as number),
  cashflowId: Id.valid(pay.cashflowId as string),
  cashflowDate: DateOnly.valid(pay.cashflowDate as string),
});

export const PayFlowCommand = {
  create: create,
  valid: valid,
};
