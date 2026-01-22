import { aBoolean } from '@/__tests__/mocks/boolean-builder';
import { aCategory } from '@/__tests__/mocks/category-builder';
import { aCount, anAmount } from '@/__tests__/mocks/number-builder';
import { aDateIntervalType } from '@/__tests__/mocks/enum-builder';
import { anAccount } from '@/__tests__/mocks/account-builder';
import { aString } from '@/__tests__/mocks/string-builder';
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
