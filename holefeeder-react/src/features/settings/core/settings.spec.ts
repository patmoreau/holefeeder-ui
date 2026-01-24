import { DateIntervalTypeErrors } from '@/shared/core/date-interval-type';
import { DateOnlyErrors } from '@/shared/core/date-only';
import { fromJson, SettingsErrors } from './settings';

describe('Settings', () => {
  it('parse valid settings JSON', () => {
    const jsonString = JSON.stringify({
      effectiveDate: '2023-01-15',
      intervalType: 'monthly',
      frequency: 1,
    });

    const result = fromJson(jsonString);

    expect(result.isFailure).toBe(false);
    if (!result.isFailure) {
      expect(result.value.effectiveDate).toBe('2023-01-15');
      expect(result.value.intervalType).toBe('monthly');
      expect(result.value.frequency).toBe(1);
    }
  });

  it('fails for invalid intervalType', () => {
    const jsonString = JSON.stringify({
      effectiveDate: '2023-01-15',
      intervalType: 'daily',
      frequency: 1,
    });

    const result = fromJson(jsonString);

    expect(result).toBeFailureWithErrors([DateIntervalTypeErrors.invalid]);
  });

  it('fails for malformed JSON', () => {
    const jsonString = '{not valid json';

    const result = fromJson(jsonString);

    expect(result).toBeFailureWithErrors([SettingsErrors.invalid]);
  });

  it('fails for missing effectiveDate', () => {
    const jsonString = JSON.stringify({
      intervalType: 'monthly',
      frequency: 1,
    });

    const result = fromJson(jsonString);

    expect(result).toBeFailureWithErrors([DateOnlyErrors.invalid]);
  });

  it('fails for invalid frequency', () => {
    const jsonString = JSON.stringify({
      effectiveDate: '2023-01-15',
      intervalType: 'monthly',
      frequency: 0,
    });

    const result = fromJson(jsonString);

    expect(result).toBeFailureWithErrors(['must be >= 1']);
  });

  it('should fail for non-object JSON', () => {
    const jsonString = JSON.stringify('just a string');

    const result = fromJson(jsonString);

    expect(result).toBeFailureWithErrors([SettingsErrors.invalid]);
  });
});
