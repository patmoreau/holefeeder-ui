import { AccountType } from '@/features/shared/core/account-type';
import { Id } from '@/shared/core/id';

export type Account = {
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
};
