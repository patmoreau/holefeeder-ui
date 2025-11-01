import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';

export interface Purchase {
  date: string;
  amount: number;
  description: string;
  account: Account | undefined;
  category: Category | undefined;
  tags: Tag[];
  cashflow?: CashflowRequest;
}

export interface CashflowRequest {
  effectiveDate: string;
  intervalType: DateIntervalType;
  frequency: number;
  recurrence: number;
}

enum DateIntervalType {
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
  oneTime = 'oneTime',
}
