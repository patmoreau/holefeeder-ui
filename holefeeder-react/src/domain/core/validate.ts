import { Result } from '@/domain/core/result';

export type Validator<T> = (value: unknown) => value is T;
export type ResultValidator<T> = (value: unknown) => Result<T>;

const executeValidator = <T>(validator: Validator<T> | ResultValidator<T>, value: unknown): Result<T> => {
  const result = (validator as Function)(value);

  if (typeof result === 'boolean') {
    return result ? Result.success(value as T) : Result.failure([]);
  }

  return result as Result<T>;
};

const validate = <T>(validator: Validator<T> | ResultValidator<T>, value: unknown, errorMessage?: string): Result<T> => {
  const result = executeValidator<T>(validator, value);
  if (result.isSuccess) {
    return result;
  }
  if (errorMessage) {
    return Result.failure([errorMessage]);
  }
  if ('errors' in result && result.errors.length) {
    return result;
  }
  return Result.failure(['Validation failed']);
};

const validateWithErrors = <T>(validator: Validator<T> | ResultValidator<T>, value: unknown, errors: string[]): Result<T> => {
  const result = executeValidator(validator, value);
  return result.isSuccess ? result : Result.failure(errors);
};

export const Validate = { validate, validateWithErrors } as const;

export const EnumValidationErrors = {
  invalidType: 'invalid-type-enum',
  invalidValue: 'invalid-value-enum',
};

export function createEnumValidator<T extends string | number>(
  enumObj: Record<string, T>,
  errors?: { invalidType?: string; invalidValue?: string }
): ResultValidator<T>;
export function createEnumValidator<T extends string | number>(
  enumObj: Record<string, T>,
  errors: { invalidType?: string; invalidValue?: string } = EnumValidationErrors
) {
  return (value: unknown): Result<T> => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return Result.failure([errors.invalidType || EnumValidationErrors.invalidType]);
    }
    if (!Object.values(enumObj).includes(value as T)) {
      return Result.failure([errors.invalidValue || EnumValidationErrors.invalidValue]);
    }
    return Result.success(value as T);
  };
}

export const PatternValidationErrors = {
  invalidType: 'invalid-type-pattern',
  patternMismatch: 'pattern-mismatch',
};

export function createPatternValidator<T extends string>(
  regex: RegExp,
  errors?: { invalidType?: string; patternMismatch?: string }
): ResultValidator<T>;
export function createPatternValidator<T extends string>(
  regex: RegExp,
  errors: { invalidType?: string; patternMismatch?: string } = PatternValidationErrors
) {
  return (value: unknown): Result<T> => {
    if (typeof value !== 'string') {
      return Result.failure([errors.invalidType || PatternValidationErrors.invalidType]);
    }
    if (!regex.test(value)) {
      return Result.failure([errors.patternMismatch || PatternValidationErrors.patternMismatch]);
    }
    return Result.success(value as T);
  };
}

export const NumberValidationErrors = {
  invalidType: 'invalid-type-number',
  min: 'min-value-error',
  max: 'max-value-error',
};

export function createNumberValidator<T extends number>(
  options?: { min?: number; max?: number },
  errors?: { min?: string; max?: string; type?: string }
): ResultValidator<T>;
export function createNumberValidator<T extends number>(
  options: { min?: number; max?: number } = {},
  errors: { min?: string; max?: string; type?: string } = NumberValidationErrors
) {
  return (value: unknown): Result<T> => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return Result.failure([errors.type || NumberValidationErrors.invalidType]);
    }
    if (options.min !== undefined && value < options.min) {
      return Result.failure([errors.min || NumberValidationErrors.min]);
    }
    if (options.max !== undefined && value > options.max) {
      return Result.failure([errors.max || NumberValidationErrors.max]);
    }
    return Result.success(value as T);
  };
}

export const StringValidationErrors = {
  invalidType: 'invalid-type-string',
  minLength: 'min-length-error',
  maxLength: 'max-length-error',
};

export function createStringValidator(
  options?: { minLength?: number; maxLength?: number },
  errors?: { invalidType?: string; minLength?: string; maxLength?: string }
): ResultValidator<string>;
export function createStringValidator(
  options: { minLength?: number; maxLength?: number } = {},
  errors: { invalidType?: string; minLength?: string; maxLength?: string } = StringValidationErrors
) {
  return (value: unknown): Result<string> => {
    if (typeof value !== 'string') {
      return Result.failure([errors.invalidType || StringValidationErrors.invalidType]);
    }
    if (options.minLength !== undefined && value.length < options.minLength) {
      return Result.failure([errors.minLength || StringValidationErrors.minLength]);
    }
    if (options.maxLength !== undefined && value.length > options.maxLength) {
      return Result.failure([errors.maxLength || StringValidationErrors.maxLength]);
    }
    return Result.success(value as string);
  };
}

export const BooleanValidationErrors = {
  invalidType: 'invalid-type-boolean',
};

export function createBooleanValidator(errors?: { invalidType?: string }): ResultValidator<boolean>;
export function createBooleanValidator(errors: { invalidType?: string } = BooleanValidationErrors) {
  return (value: unknown): Result<boolean> => {
    if (typeof value !== 'boolean') {
      return Result.failure([errors.invalidType || BooleanValidationErrors.invalidType]);
    }
    return Result.success(value);
  };
}

export const ArrayValidationErrors = {
  invalidType: 'invalid-type-array',
  itemInvalid: 'item-invalid',
};

export function createArrayValidator<T>(
  itemValidator: Validator<T> | ResultValidator<T>,
  errors?: { invalidType?: string; itemInvalid?: string }
): ResultValidator<T[]>;
export function createArrayValidator<T>(
  itemValidator: Validator<T> | ResultValidator<T>,
  errors: { invalidType?: string; itemInvalid?: string } = ArrayValidationErrors
) {
  return (value: unknown): Result<T[]> => {
    if (!Array.isArray(value)) {
      return Result.failure([errors.invalidType || ArrayValidationErrors.invalidType]);
    }

    // Validate all items
    for (const item of value) {
      const result = executeValidator(itemValidator, item);
      if (result.isFailure) {
        // We could aggregate errors or fail fast. For now, fail fast with a generic item error or the specific error.
        // If the specific item validator returned errors, we might want to use them?
        // But the requirement here is to have overrides.
        // If errors.itemInvalid is provided, use it. Otherwise use the item's error if available.
        return Result.failure([errors.itemInvalid || (result.errors.length ? result.errors[0] : ArrayValidationErrors.itemInvalid)]);
      }
    }

    return Result.success(value as T[]);
  };
}
