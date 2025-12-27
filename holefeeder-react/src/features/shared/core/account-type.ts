export const AccountType = {
  checking: 'checking',
  creditCard: 'creditCard',
  creditLine: 'creditLine',
  investment: 'investment',
  loan: 'loan',
  mortgage: 'mortgage',
  savings: 'savings',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];
