import { CategoryType } from '@/shared/core/category-type';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

export type Category = {
  id: Id;
  name: string;
  type: CategoryType;
  color: string;
  budgetAmount: Money;
  favorite: boolean;
  system: boolean;
};
