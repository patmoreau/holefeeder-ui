import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId } from '@/__tests__/mocks/string-for-test';
import { AccountVariation } from '@/domain/core/accounts/account-variation';

const defaultAccountVariation = (): AccountVariation => ({
  accountId: anId(),
  lastTransactionDate: aRecentDate(),
  expenses: anAmount(),
  gains: anAmount(),
});

export const anAccountVariation = (overrides?: Partial<AccountVariation>): AccountVariation => ({
  ...defaultAccountVariation(),
  ...overrides,
});
