import { DateIntervalType, DateIntervalTypeErrors, DateIntervalTypes } from '@/shared/core/date-interval-type';

describe('DateIntervalType', () => {
  it.each(Object.values(DateIntervalTypes))('accepts %s for DateIntervalType', (value) => {
    const result = DateIntervalType.create(value);
    expect(result).toBeSuccessWithValue(value);
  });

  it('rejects invalid DateIntervalType', () => {
    const result = DateIntervalType.create('invalid-type');
    expect(result).toBeFailureWithErrors([DateIntervalTypeErrors.invalid]);
  });

  it('rejects empty DateIntervalType', () => {
    const result = DateIntervalType.create('');
    expect(result).toBeFailureWithErrors([DateIntervalTypeErrors.invalid]);
  });

  it('rejects wrong type DateIntervalType', () => {
    const result = DateIntervalType.create(123);
    expect(result).toBeFailureWithErrors([DateIntervalTypeErrors.invalid]);
  });
});
