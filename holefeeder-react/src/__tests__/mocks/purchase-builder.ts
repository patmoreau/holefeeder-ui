import { aBoolean, aCategory, aCount, aDateIntervalType, anAccount, anAmount, aString } from '@/__tests__';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { aTag } from './tag-builder';

const defaultPurchase = (): PurchaseFormData => ({
  date: new Date().toISOString(),
  amount: anAmount(),
  description: aString(),
  sourceAccount: anAccount(),
  category: aCategory(),
  tags: [aTag()],
  hasCashflow: aBoolean(),
  cashflowEffectiveDate: new Date().toISOString(),
  cashflowIntervalType: aDateIntervalType(),
  cashflowFrequency: aCount(),
  purchaseType: PurchaseType.expense,
  targetAccount: anAccount(),
});

export const aPurchase = (overrides: Partial<PurchaseFormData> = {}): PurchaseFormData => ({ ...defaultPurchase(), ...overrides });

export const aTransfer = (overrides: Partial<PurchaseFormData> = {}): PurchaseFormData => ({
  ...defaultPurchase(),
  ...overrides,
  purchaseType: PurchaseType.transfer,
});
