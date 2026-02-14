import { CategoryType } from '@/domain/core/categories/category-type';
import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { TagList } from './tag-list';

export type Transaction = {
  id: Id;
  date: DateOnly;
  amount: Money;
  description: string;
  accountId: Id;
  categoryId: Id;
  categoryType: CategoryType;
  tags: TagList;
  cashflowId?: Id;
  cashflowDate?: DateOnly;
};

const valid = (value: Record<string, unknown>): Transaction => ({
  id: Id.valid(value.id as string),
  date: DateOnly.valid(value.date as string),
  amount: Money.valid(value.amount as number),
  description: value.description as string,
  accountId: Id.valid(value.accountId as string),
  categoryId: Id.valid(value.categoryId as string),
  categoryType: CategoryType.valid(value.categoryType as string),
  tags: TagList.valid(value.tags as string[]),
  cashflowId: value.cashflowId ? Id.valid(value.cashflowId as Id) : undefined,
  cashflowDate: value.cashflowDate ? DateOnly.valid(value.cashflowDate as DateOnly) : undefined,
});

export const Transaction = { valid: valid };
