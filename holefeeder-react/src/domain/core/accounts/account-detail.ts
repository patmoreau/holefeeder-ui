import { AccountType } from '@/domain/core/accounts/account-type';
import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Variation } from '@/domain/core/variation';

export type AccountDetail = {
  id: Id;
  name: string;
  type: AccountType;
  balance: Variation;
  lastTransactionDate: DateOnly;
  projectedBalance: Variation;
  upcomingVariation: Variation;
};

const valid = (value: Record<string, unknown>): AccountDetail => ({
  id: Id.valid(value.id),
  name: value.name as string,
  type: AccountType.valid(value.type),
  balance: Variation.valid(value.balance),
  lastTransactionDate: DateOnly.valid(value.lastTransactionDate),
  projectedBalance: Variation.valid(value.projectedBalance),
  upcomingVariation: Variation.valid(value.upcomingVariation),
});

export const AccountDetail = {
  valid: valid,
};
