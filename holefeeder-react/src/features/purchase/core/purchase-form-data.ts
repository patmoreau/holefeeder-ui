import { Account } from '@/domain/core/accounts/account';
import { Category } from '@/domain/core/categories/category';
import { Tag } from '@/domain/core/flows/tag';
import { DateIntervalType } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';

export const PurchaseType = {
  expense: 'expense',
  gain: 'gain',
  transfer: 'transfer',
} as const;

export type PurchaseType = (typeof PurchaseType)[keyof typeof PurchaseType];

export type PurchaseFormData = {
  purchaseType: PurchaseType;
  date: DateOnly;
  amount: number;
  description: string;
  sourceAccount: Account;
  targetAccount: Account;
  category: Category;
  tags: Tag[];
  hasCashflow: boolean;
  cashflowEffectiveDate: DateOnly;
  cashflowIntervalType: DateIntervalType;
  cashflowFrequency: number;
};
