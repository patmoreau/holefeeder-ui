import { CategoryType, CategoryTypeErrors, CategoryTypes } from '@/use-cases/core/categories/category-type';

describe('CategoryType', () => {
  it.each(Object.values(CategoryTypes))('accepts %s for CategoryType', (value) => {
    const result = CategoryType.create(value);
    expect(result).toBeSuccessWithValue(value);
  });

  it('rejects invalid CategoryType', () => {
    const result = CategoryType.create('invalid-type');
    expect(result).toBeFailureWithErrors([CategoryTypeErrors.invalid]);
  });

  it('rejects empty CategoryType', () => {
    const result = CategoryType.create('');
    expect(result).toBeFailureWithErrors([CategoryTypeErrors.invalid]);
  });

  it('rejects wrong type CategoryType', () => {
    const result = CategoryType.create(123);
    expect(result).toBeFailureWithErrors([CategoryTypeErrors.invalid]);
  });

  it('valid returns the value directly', () => {
    const value = CategoryTypes.expense;
    const result = CategoryType.valid(value);
    expect(result).toBe(value);
  });
});
