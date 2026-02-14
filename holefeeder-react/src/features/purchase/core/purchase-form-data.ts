import { Account } from '@/domain/core/accounts/account';
import { Category } from '@/domain/core/categories/category';
import { DateIntervalType } from '@/domain/core/date-interval-type';
import { Tag } from '@/domain/core/flows/tag';

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
