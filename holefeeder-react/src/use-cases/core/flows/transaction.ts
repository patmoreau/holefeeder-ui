import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

export type Transaction = {
  id: Id;
  date: DateOnly;
  amount: Money;
  description: string;
  accountId: Id;
  categoryId: Id;
  tags: string[];
  cashflowId?: Id;
  cashflowDate?: DateOnly;
};
