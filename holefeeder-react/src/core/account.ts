export enum AccountType {
  Checking = 'checking',
  CreditCard = 'savings',
  CreditLine = 'credit',
  Investment = 'investment',
  Loan = 'loan',
  Mortgage = 'mortgage',
  Savings = 'savings',
}

export interface Account {
  id: string;
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
