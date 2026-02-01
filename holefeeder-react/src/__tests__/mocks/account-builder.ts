import { aBoolean } from '@/__tests__/mocks/boolean-builder';
import { aPastDate, aRecentDate } from '@/__tests__/mocks/date-builder';
import { anAccountType } from '@/__tests__/mocks/enum-builder';
import { aCount, anAmount } from '@/__tests__/mocks/number-builder';
import { anId, aString } from '@/__tests__/mocks/string-builder';
import { AccountDetails } from '@/use-cases/core/dashboard/account-details';

const defaultData = (): AccountDetails => ({
  id: anId(),
  type: anAccountType(),
  name: aString(),
  openBalance: anAmount(),
  openDate: aPastDate(),
  transactionCount: aCount(),
  balance: anAmount(),
  updated: aRecentDate(),
  upcomingVariation: anAmount(),
  projectedBalance: anAmount(),
  description: aString(),
  favorite: aBoolean(),
  inactive: aBoolean(),
});

export const anAccountDetails = (data: Partial<AccountDetails> = {}): AccountDetails => ({ ...defaultData(), ...data });
