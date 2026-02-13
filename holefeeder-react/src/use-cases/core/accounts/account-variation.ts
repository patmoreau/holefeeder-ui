import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

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
