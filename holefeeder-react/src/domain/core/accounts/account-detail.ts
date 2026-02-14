import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Variation } from '@/domain/core/variation';

export type AccountDetail = {
  id: Id;
  name: string;
  balance: Variation;
  lastTransactionDate: DateOnly;
  projectedBalance: Variation;
  upcomingVariation: Variation;
};

const valid = (value: Record<string, unknown>): AccountDetail => ({
  id: Id.valid(value.id as string),
  name: value.name as string,
  balance: Variation.valid(value.balance as number),
  lastTransactionDate: DateOnly.valid(value.lastTransactionDate as string),
  projectedBalance: Variation.valid(value.projectedBalance as number),
  upcomingVariation: Variation.valid(value.upcomingVariation as number),
});

export const AccountDetail = {
  valid: valid,
};
