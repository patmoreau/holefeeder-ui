import { Account } from '@/use-cases/core/accounts/account';
import { AccountDetail } from '../../use-cases/core/accounts/account-detail';
import { aPastDate } from '../mocks/date-builder';
import { anAmount } from '../mocks/number-builder';
import { aString } from '../mocks/string-builder';

const defaultAccountDetail = (): AccountDetail => ({
  name: aString(),
  balance: anAmount(),
  lastTransactionDate: aPastDate(),
  projectedBalance: anAmount(),
  upcomingVariation: anAmount(),
});

export const anAccountDetail = (overrides?: Partial<Account>): AccountDetail => ({
  ...defaultAccountDetail(),
  ...overrides,
});
