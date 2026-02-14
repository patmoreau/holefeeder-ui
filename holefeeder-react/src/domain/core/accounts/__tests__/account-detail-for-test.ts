import { Account } from '@/domain/core/accounts/account';
import { aPastDate } from '../../../../__tests__/mocks/date-for-test';
import { aVariation } from '../../../../__tests__/mocks/number-for-test';
import { anId, aString } from '../../../../__tests__/mocks/string-for-test';
import { AccountDetail } from '../account-detail';

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
