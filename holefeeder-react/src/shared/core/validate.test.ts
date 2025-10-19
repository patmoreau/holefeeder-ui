import { Validate } from '@/shared/core/validate';

describe('Validate.validate', () => {
  type Model = { name: string };

  const schema = {
    $id: 'test://schemas/model',
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
    // ajv-errors custom messages
    errorMessage: {
      required: {
        name: 'name is required',
      },
      additionalProperties: 'no extras',
    },
  } as const;

  it('returns Success with the validated value when input matches schema', () => {
    const value = { name: 'Alice' };

    const result = Validate.validate<Model>(schema, value);

    expect(result.isFailure).toBe(false);
    if (!result.isFailure) {
      expect(result.value).toEqual(value);
    }
  });

  it('returns Failure with custom message when a required property is missing', () => {
    const result = Validate.validate<Model>(schema, {});

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toEqual(expect.arrayContaining(['name is required']));
    }
  });

  it('returns Failure with custom message when additional properties are present', () => {
    const result = Validate.validate<Model>(schema, { name: 'Bob', extra: true });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toEqual(expect.arrayContaining(['no extras']));
    }
  });

  it('can be called repeatedly for the same schema id without redefinition errors (schema caching)', () => {
    const value = { name: 'Charlie' };

    const first = Validate.validate<Model>(schema, value);
    const second = Validate.validate<Model>({ ...schema }, value); // same $id

    expect(first.isFailure).toBe(false);
    expect(second.isFailure).toBe(false);
  });

  it('returns Failure with at least one error message on type mismatch', () => {
    const result = Validate.validate<Model>(schema, { name: 123 });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(Array.isArray(result.error)).toBe(true);
      expect(result.error.length).toBeGreaterThan(0);
      // messages are strings
      result.error.forEach((m) => expect(typeof m).toBe('string'));
    }
  });
});
