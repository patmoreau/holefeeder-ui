import { Purchase } from '../../features/purchase/core/purchase';
import { anAccount } from './account-builder';
import { aCategory } from './category-builder';
import { anAmount } from './number-builder';
import { aString } from './string-builder';
import { aTag } from './tag-builder';

const defaultPurchase = (): Purchase => ({
  date: new Date().toISOString(),
  amount: anAmount(),
  description: aString(),
  account: anAccount(),
  category: aCategory(),
  tags: [aTag()],
});

export const aPurchase = (overrides: Partial<Purchase> = {}): Purchase => ({ ...defaultPurchase(), ...overrides });
