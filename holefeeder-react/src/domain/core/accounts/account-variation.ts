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
  accountId: Id.valid(value.accountId),
  lastTransactionDate: DateOnly.valid(value.lastTransactionDate),
  expenses: Money.valid(value.expenses),
  gains: Money.valid(value.gains),
});

export const AccountVariation = {
  valid: valid,
};
