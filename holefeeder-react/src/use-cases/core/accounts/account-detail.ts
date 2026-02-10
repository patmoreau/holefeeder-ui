import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

export type AccountDetail = {
  id: Id;
  name: string;
  balance: Money;
  lastTransactionDate: DateOnly;
  projectedBalance: Money;
  upcomingVariation: Money;
};

const valid = (value: Record<string, unknown>): AccountDetail => ({
  id: Id.valid(value.id as string),
  name: value.name as string,
  balance: Money.valid(value.balance as number),
  lastTransactionDate: DateOnly.valid(value.lastTransactionDate as string),
  projectedBalance: Money.valid(value.projectedBalance as number),
  upcomingVariation: Money.valid(value.upcomingVariation as number),
});

export const AccountDetail = {
  valid: valid,
};
