import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { Tag } from '@/features/purchase/core/tag';

export interface PurchaseFormData {
  date: string;
  amount: number;
  description: string;
  sourceAccount: Account;
  targetAccount: Account;
  category: Category;
  tags: Tag[];
  hasCashflow: boolean;
  cashflowEffectiveDate: string;
  cashflowIntervalType: DateIntervalType;
  cashflowFrequency: number;
  transfer: boolean;
}
