import { DateOnly } from '@/shared/core/date-only';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Account } from '@/use-cases/core/accounts/account';
import { AccountType } from '@/use-cases/core/accounts/account-type';
import { CategoryType } from '@/use-cases/core/categories/category-type';
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

const calculateBalance = (account: Account, transactions: Transaction[]) =>
  transactions.reduce(
    (acc, curr) => Money.valid(acc + curr.amount * CategoryType.multiplier[curr.categoryType] * AccountType.multiplier[account.type]),
    account.openBalance
  );

const calculateUpdatedDate = (account: Account, transactions: Transaction[]) => {
  return transactions.length > 0 ? transactions.reduce((acc, curr) => (acc > curr.date ? acc : curr.date), '') : account.openDate;
};

export const Transaction = { valid: valid, calculateBalance: calculateBalance, calculateUpdatedDate: calculateUpdatedDate };
