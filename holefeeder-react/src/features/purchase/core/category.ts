import { CategoryType } from '@/features/purchase/core/category-type';
import { Id } from '@/features/purchase/core/id';

export interface Category {
  id: Id;
  name: string;
  type: CategoryType;
  color: string;
  budgetAmount: number;
  favorite: boolean;
}
