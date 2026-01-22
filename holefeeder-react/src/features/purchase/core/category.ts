import { CategoryType } from '@/core/category-type';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

export interface Category {
  id: Id;
  name: string;
  type: CategoryType;
  color: string;
  budgetAmount: Money;
  favorite: boolean;
}
