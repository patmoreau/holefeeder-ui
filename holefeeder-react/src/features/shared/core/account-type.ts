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

export const normalizeAccountType = (type: string): AccountType => {
  const normalized = type.trim().toLowerCase();
  switch (normalized) {
    case 'checking':
      return AccountType.checking;
    case 'creditcard':
    case 'credit_card':
      return AccountType.creditCard;
    case 'creditline':
    case 'credit_line':
      return AccountType.creditLine;
    case 'investment':
      return AccountType.investment;
    case 'loan':
      return AccountType.loan;
    case 'mortgage':
      return AccountType.mortgage;
    case 'savings':
      return AccountType.savings;
    default:
      return AccountType.checking;
  }
};
