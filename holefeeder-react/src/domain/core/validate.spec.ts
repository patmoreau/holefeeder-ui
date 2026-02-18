import {
  ArrayValidationErrors,
  BooleanValidationErrors,
  createArrayValidator,
  createBooleanValidator,
  createEnumValidator,
  createNumberValidator,
  createPatternValidator,
  createStringValidator,
  EnumValidationErrors,
  NumberValidationErrors,
  PatternValidationErrors,
  StringValidationErrors,
  Validate,
} from '@/domain/core/validate';

describe('Validate.validate', () => {
  const isValid = createNumberValidator({ min: 1, max: 10 }, { type: 'type-error', min: 'minimum-error', max: 'maximum-error' });

  it('returns success for valid values', () => {
    const result = Validate.validate<number>(isValid, 5);

    expect(result).toBeSuccessWithValue(5);
  });

  it('returns failure for invalid values', () => {
    const result = Validate.validate<number>(isValid, 10.5);

    expect(result).toBeFailureWithErrors(['maximum-error']);
  });

  it('returns failure with default error message when no custom errors provided', () => {
    const isValidWithDefaults = createNumberValidator({ min: 1, max: 10 });
    const result = Validate.validate(isValidWithDefaults, 10.5);

    expect(result).toBeFailureWithErrors([NumberValidationErrors.max]);
  });
});

describe('createEnumValidator', () => {
  enum TestEnum {
    A = 'A',
    B = 'B',
  }

  const validator = createEnumValidator(TestEnum);

  it('returns success for valid enum values', () => {
    expect(validator('A')).toBeSuccessWithValue('A');
    expect(validator('B')).toBeSuccessWithValue('B');
  });

  it('returns failure for invalid enum values', () => {
    expect(validator('C')).toBeFailureWithErrors([EnumValidationErrors.invalidValue]);
  });

  it('returns failure for invalid type', () => {
    expect(validator(123)).toBeFailureWithErrors([EnumValidationErrors.invalidValue]);
  });
});

describe('createPatternValidator', () => {
  const pattern = /^[a-z]+$/;
  const validator = createPatternValidator(pattern);

  it('returns success for matching pattern', () => {
    expect(validator('abc')).toBeSuccessWithValue('abc');
  });

  it('returns failure for non-matching pattern', () => {
    expect(validator('123')).toBeFailureWithErrors([PatternValidationErrors.patternMismatch]);
  });

  it('returns failure for invalid type', () => {
    expect(validator(123)).toBeFailureWithErrors([PatternValidationErrors.invalidType]);
  });
});

describe('createNumberValidator', () => {
  const validator = createNumberValidator({ min: 10, max: 20 });

  it('returns success for valid number', () => {
    expect(validator(15)).toBeSuccessWithValue(15);
  });

  it('returns failure for value less than min', () => {
    expect(validator(5)).toBeFailureWithErrors([NumberValidationErrors.min]);
  });

  it('returns failure for value greater than max', () => {
    expect(validator(25)).toBeFailureWithErrors([NumberValidationErrors.max]);
  });

  it('returns failure for invalid type', () => {
    expect(validator('15')).toBeFailureWithErrors([NumberValidationErrors.invalidType]);
  });
});

describe('createStringValidator', () => {
  const validator = createStringValidator({ minLength: 3, maxLength: 5 });

  it('returns success for valid string length', () => {
    expect(validator('abcd')).toBeSuccessWithValue('abcd');
  });

  it('returns failure for string too short', () => {
    expect(validator('ab')).toBeFailureWithErrors([StringValidationErrors.minLength]);
  });

  it('returns failure for string too long', () => {
    expect(validator('abcdef')).toBeFailureWithErrors([StringValidationErrors.maxLength]);
  });

  it('returns failure for invalid type', () => {
    expect(validator(123)).toBeFailureWithErrors([StringValidationErrors.invalidType]);
  });
});

describe('createBooleanValidator', () => {
  const validator = createBooleanValidator();

  it('returns success for boolean true', () => {
    expect(validator(true)).toBeSuccessWithValue(true);
  });

  it('returns success for boolean false', () => {
    expect(validator(false)).toBeSuccessWithValue(false);
  });

  it('returns failure for invalid type', () => {
    expect(validator('true')).toBeFailureWithErrors([BooleanValidationErrors.invalidType]);
  });
});

describe('createArrayValidator', () => {
  const itemValidator = createStringValidator({ minLength: 2 });
  const validator = createArrayValidator(itemValidator);

  it('returns success for valid array', () => {
    expect(validator(['abc', 'def'])).toBeSuccessWithValue(['abc', 'def']);
  });

  it('returns failure for array with invalid item', () => {
    expect(validator(['a', 'def'])).toBeFailureWithErrors([StringValidationErrors.minLength]);
  });

  it('returns failure for invalid type', () => {
    expect(validator('not-an-array')).toBeFailureWithErrors([ArrayValidationErrors.invalidType]);
  });
});
