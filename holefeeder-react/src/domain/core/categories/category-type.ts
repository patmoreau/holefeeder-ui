import { Result } from '@/domain/core/result';
import { Validate } from '@/domain/core/validate';

export const CategoryTypes = {
  expense: 'expense',
  gain: 'gain',
} as const;

export type CategoryType = (typeof CategoryTypes)[keyof typeof CategoryTypes];

export const CategoryTypeErrors = {
  invalid: 'category-type-invalid',
};

const normalizeCategoryType = (type: string): CategoryType => {
  const normalized = type.trim().toLowerCase();
  if (normalized === 'expense') return CategoryTypes.expense;
  if (normalized === 'gain') return CategoryTypes.gain;
  return CategoryTypes.expense;
};

const schema = {
  $id: 'category-type',
  enum: Object.values(CategoryTypes),
};

const create = (value: unknown): Result<CategoryType> => {
  let normalized = value;
  if (typeof value === 'string') {
    const candidate = value.trim().toLowerCase();
    if (Object.values(CategoryTypes).includes(candidate as CategoryType)) {
      normalized = candidate;
    }
  }

  const result = Validate.validateWithErrors(schema, normalized, [CategoryTypeErrors.invalid]);
  if (Result.isSuccess(result)) {
    return Result.success(normalized as CategoryType);
  }
  return result;
};

const valid = (value: unknown): CategoryType => {
  return normalizeCategoryType(value as string);
};

const multiplier = {
  [CategoryTypes.expense]: -1,
  [CategoryTypes.gain]: 1,
};

export const CategoryType = {
  create: create,
  valid: valid,
  multiplier: multiplier,
};
