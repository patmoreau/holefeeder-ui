import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type DateOnly = string & { readonly __brand: 'DateOnly' };

export const DateOnlyErrors = {
  invalid: 'date-invalid',
};

const schema = {
  $id: 'dateOnly',
  type: 'string',
  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
};

const create = (value: unknown): Result<DateOnly> => {
  const patternResult = Validate.validateWithErrors<DateOnly>(schema, value, [DateOnlyErrors.invalid]);

  if (!Result.isSuccess(patternResult)) {
    return patternResult;
  }

  const stringValue = patternResult.value;

  const jsDate = new globalThis.Date(stringValue);
  const isValidDate = !isNaN(jsDate.getTime()) && jsDate.toISOString().startsWith(stringValue);

  return isValidDate ? Result.success(stringValue as DateOnly) : Result.failure([DateOnlyErrors.invalid]);
};

const valid = (value: string): DateOnly => value as DateOnly;

export const DateOnly = { create: create, valid: valid } as const;
