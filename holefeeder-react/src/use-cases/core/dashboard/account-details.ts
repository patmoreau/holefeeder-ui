import { Id } from '@/shared/core/id';
import { AccountType } from '@/use-cases/core/accounts/account-type';

export type AccountDetails = {
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
