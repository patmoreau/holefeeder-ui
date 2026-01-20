import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { DateIntervalType } from '@/features/shared/core/date-interval-type';

export const PurchaseType = {
  expense: 'expense',
  gain: 'gain',
  transfer: 'transfer',
} as const;

export type PurchaseType = (typeof PurchaseType)[keyof typeof PurchaseType];

export type PurchaseFormData = {
  purchaseType: PurchaseType;
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
};
