export const AccountType = {
  Checking: 'checking',
  CreditCard: 'savings',
  CreditLine: 'credit',
  Investment: 'investment',
  Loan: 'loan',
  Mortgage: 'mortgage',
  Savings: 'savings',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];
