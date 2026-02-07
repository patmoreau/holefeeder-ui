import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export const CategoryTypes = {
  expense: 'expense',
  gain: 'gain',
} as const;

export type CategoryType = (typeof CategoryTypes)[keyof typeof CategoryTypes];

export const CategoryTypeErrors = {
  invalid: 'category-type-invalid',
};

export const normalizeCategoryType = (type: string): CategoryType => {
  const normalized = type.trim().toLowerCase();
  if (normalized === 'expense') return CategoryTypes.expense;
  if (normalized === 'gain') return CategoryTypes.gain;
  return CategoryTypes.expense;
};

const schema = {
  $id: 'category-type',
  enum: Object.values(CategoryTypes),
};

const create = (value: unknown): Result<CategoryType> => Validate.validateWithErrors(schema, value, [CategoryTypeErrors.invalid]);

const valid = (value: unknown): CategoryType => {
  return value as CategoryType;
};

export const CategoryType = {
  create: create,
  valid: valid,
};
