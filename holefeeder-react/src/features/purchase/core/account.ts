import { AccountType } from '@/features/purchase/core/account-type';
import { Id } from '@/features/purchase/core/id';

export interface Account {
  id: Id;
  type: AccountType;
  name: string;
  openBalance: number;
  openDate: string;
  transactionCount: number;
  balance: number;
  updated?: string;
  description: string;
  favorite: boolean;
  inactive: boolean;
}
