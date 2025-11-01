import { aBoolean } from '@/__tests__/mocks/boolean-builder';
import { anAmount } from '@/__tests__/mocks/number-builder';
import { aColor, anId, aString } from '@/__tests__/mocks/string-builder';
import { Category } from '@/features/purchase/core/category';

const defaultData = (): Category => ({
  id: anId(),
  name: aString(),
  color: aColor(),
  budgetAmount: anAmount(),
  favorite: aBoolean(),
});

export const aCategory = (data: Partial<Category> = {}): Category => ({ ...defaultData(), ...data });
