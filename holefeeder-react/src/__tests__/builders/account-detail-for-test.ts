import { Account } from '@/use-cases/core/accounts/account';
import { AccountDetail } from '../../use-cases/core/accounts/account-detail';
import { aPastDate } from '../mocks/date-builder';
import { aVariation } from '../mocks/number-builder';
import { anId, aString } from '../mocks/string-builder';

const defaultAccountDetail = (): AccountDetail => ({
  id: anId(),
  name: aString(),
  balance: aVariation(),
  lastTransactionDate: aPastDate(),
  projectedBalance: aVariation(),
  upcomingVariation: aVariation(),
});

export const anAccountDetail = (overrides?: Partial<Account>): AccountDetail => ({
  ...defaultAccountDetail(),
  ...overrides,
});
