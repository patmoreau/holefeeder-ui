import { Validate } from '@/shared/core/validate';

describe('Validate.validate', () => {
  const schema = {
    $id: 'test-schema',
    type: 'integer',
    minimum: 1,
    maximum: 10,
    errorMessage: {
      type: 'type-error',
      maximum: 'maximum-error',
    },
  } as const;

  it('returns success for valid values', () => {
    const result = Validate.validate<number>(schema, 5);

    expect(result).toBeSuccessWithValue(5);
  });

  it('returns failure for invalid values', () => {
    const result = Validate.validate<number>(schema, 10.5);

    expect(result).toBeFailureWithErrors(['type-error', 'maximum-error']);
  });
});
