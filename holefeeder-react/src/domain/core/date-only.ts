import { Result } from '@/domain/core/result';
import { Validate, Validator } from '@/domain/core/validate';

export type DateOnly = string & { readonly __brand: 'DateOnly' };

export const DateOnlyErrors = {
  invalid: 'date-invalid',
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const isValidPattern = Validator.patternValidator<DateOnly>({ pattern: DATE_ONLY_PATTERN });

const create = (value: unknown): Result<DateOnly> => {
  const patternResult = Validate.validate<DateOnly>(isValidPattern, value, [DateOnlyErrors.invalid]);

  if (!patternResult.isSuccess) {
    return patternResult;
  }

  const stringValue = patternResult.value;

  const jsDate = new globalThis.Date(stringValue);
  const isValidDate = !isNaN(jsDate.getTime()) && jsDate.toISOString().startsWith(stringValue);

  return isValidDate ? Result.success(stringValue as DateOnly) : Result.failure([DateOnlyErrors.invalid]);
};

const valid = (value: string): DateOnly => value as DateOnly;

export const DateOnly = { create: create, valid: valid } as const;
