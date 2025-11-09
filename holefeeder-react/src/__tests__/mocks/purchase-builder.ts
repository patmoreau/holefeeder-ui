import { anAccount, aCategory, anAmount, aString, aBoolean, aDateIntervalType, aCount } from '@/__tests__';
import { Purchase } from '@/features/purchase/core/purchase';
import { aTag } from './tag-builder';

const defaultPurchase = (): Purchase => ({
  date: new Date().toISOString(),
  amount: anAmount(),
  description: aString(),
  account: anAccount(),
  category: aCategory(),
  tags: [aTag()],
  hasCashflow: aBoolean(),
  cashflowEffectiveDate: new Date().toISOString(),
  cashflowIntervalType: aDateIntervalType(),
  cashflowFrequency: aCount(),
});

export const aPurchase = (overrides: Partial<Purchase> = {}): Purchase => ({ ...defaultPurchase(), ...overrides });
