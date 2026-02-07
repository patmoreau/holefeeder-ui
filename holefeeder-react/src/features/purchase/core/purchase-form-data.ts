import { DateIntervalType } from '@/shared/core/date-interval-type';
import { Account } from '@/use-cases/core/accounts/account';
import { Category } from '@/use-cases/core/categories/category';
import { Tag } from '@/use-cases/core/flows/tag';

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
