import { aBoolean } from '@/__tests__/mocks/boolean-builder';
import { aDateIntervalType } from '@/__tests__/mocks/enum-builder';
import { aCount, anAmount } from '@/__tests__/mocks/number-builder';
import { aString } from '@/__tests__/mocks/string-builder';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { aTagList } from '../../use-cases/__tests__/tag-list-for-test';
import { anAccount } from '../builders/account-for-test';
import { aCategory } from '../builders/category-for-test';
import { aRecentDate } from './date-builder';

const defaultPurchase = (): PurchaseFormData => ({
  date: aRecentDate(),
  amount: anAmount(),
  description: aString(),
  sourceAccount: anAccount(),
  category: aCategory(),
  tags: aTagList(),
  hasCashflow: aBoolean(),
  cashflowEffectiveDate: aRecentDate(),
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
