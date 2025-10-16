import { aBoolean } from '@/__tests__/mocks/boolean-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { aColor, anId, aString } from '@/__tests__/mocks/string-for-test';
import { Category } from '@/core/category';

const defaultData = (): Category => ({
  id: anId(),
  name: aString(),
  color: aColor(),
  budgetAmount: anAmount(),
  favorite: aBoolean(),
});

export const aCategory = (data: Partial<Category> = {}): Category => ({ ...defaultData(), ...data });
