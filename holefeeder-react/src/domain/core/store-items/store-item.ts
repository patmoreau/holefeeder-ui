import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';
import { Validate, Validator } from '@/domain/core/validate';

export type StoreItem = {
  id: Id;
  code: string;
  data: string;
};

export const StoreItemErrors = {
  invalidCode: 'invalid-code',
  invalidData: 'invalid-data',
};

const isValidJson = (value: unknown): Result<string> => {
  if (typeof value !== 'string') return Result.failure([StoreItemErrors.invalidData]);
  try {
    JSON.parse(value);
    return Result.success(value);
  } catch {
    return Result.failure([StoreItemErrors.invalidData]);
  }
};

const isValidCode = Validator.string({ minLength: 1 });

const create = (value: Record<string, unknown>): Result<StoreItem> => {
  return Result.combine<StoreItem>({
    id: Id.create(value.id),
    code: Validate.validate(isValidCode, value.code, [StoreItemErrors.invalidCode]),
    data: isValidJson(value.data),
  });
};

export const StoreItem = {
  create: create,
};
