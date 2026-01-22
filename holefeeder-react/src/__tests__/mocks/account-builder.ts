import { aBoolean } from '@/__tests__/mocks/boolean-builder';
import { aCount, anAmount } from '@/__tests__/mocks/number-builder';
import { anAccountType } from '@/__tests__/mocks/enum-builder';
import { anId, aString } from '@/__tests__/mocks/string-builder';
import { aPastDate, aRecentDate } from '@/__tests__/mocks/date-builder';
import { Account } from '@/features/shared/core/account';

const defaultData = (): Account => ({
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

export const anAccount = (data: Partial<Account> = {}): Account => ({ ...defaultData(), ...data });
