import { aBoolean, aCount, anAccountType, anAmount, anId, aPastDate, aRecentDate, aString } from '@/__tests__';
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
