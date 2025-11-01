import { Id } from '@/features/purchase/core/id';

export interface Category {
  id: Id;
  name: string;
  color: string;
  budgetAmount: number;
  favorite: boolean;
}
