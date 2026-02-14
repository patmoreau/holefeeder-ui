import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';

export type AccountVariation = {
  accountId: Id;
  lastTransactionDate: DateOnly;
  expenses: Money;
  gains: Money;
};

const valid = (value: Record<string, unknown>): AccountVariation => ({
  accountId: Id.valid(value.accountId as string),
  lastTransactionDate: DateOnly.valid(value.lastTransactionDate as string),
  expenses: Money.valid(value.expenses as number),
  gains: Money.valid(value.gains as number),
});

export const AccountVariation = {
  valid: valid,
};
