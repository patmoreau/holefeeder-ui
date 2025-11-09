import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { Tag } from '@/features/purchase/core/tag';

export interface Purchase {
  date: string;
  amount: number;
  description: string;
  account: Account | undefined;
  category: Category | undefined;
  tags: Tag[];
  hasCashflow: boolean;
  cashflowEffectiveDate: string;
  cashflowIntervalType: DateIntervalType;
  cashflowFrequency: number;
}
