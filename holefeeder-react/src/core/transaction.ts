import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

export type Transaction = {
  id: Id;
  date: string;
  amount: Money;
  description: string;
  accountId: Id;
  categoryId: Id;
  cashflowId: Id;
  cashflowDate: string;
  tags: string[];
};
