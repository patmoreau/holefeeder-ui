import { AccountType } from '@/features/shared/core/account-type';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';

export type Account = {
  id: Id;
  type: AccountType;
  name: string;
  openBalance: Money;
  openDate: string;
  description: string;
  favorite: boolean;
  inactive: boolean;
};
