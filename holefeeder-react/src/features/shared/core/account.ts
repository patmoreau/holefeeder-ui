import { Id } from '@/features/purchase/core/id';
import { AccountType } from '@/features/shared/core/account-type';

export interface Account {
  id: Id;
  type: AccountType;
  name: string;
  openBalance: number;
  openDate: string;
  transactionCount: number;
  balance: number;
  updated?: string;
  upcomingVariation: number;
  projectedBalance: number;
  description: string;
  favorite: boolean;
  inactive: boolean;
}
