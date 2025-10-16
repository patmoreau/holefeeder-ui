import { aBoolean, aPastDate, aRecentDate, anAccountType, aCount, anAmount, anId, aString } from '@/__tests__';
import { Account } from '@/core/account';

const defaultData = (): Account => ({
  id: anId(),
  type: anAccountType(),
  name: aString(),
  openBalance: anAmount(),
  openDate: aPastDate(),
  transactionCount: aCount(),
  balance: anAmount(),
  updated: aRecentDate(),
  description: aString(),
  favorite: aBoolean(),
  inactive: aBoolean(),
});

export const anAccount = (data: Partial<Account> = {}): Account => ({ ...defaultData(), ...data });
