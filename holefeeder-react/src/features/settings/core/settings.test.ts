import { describe, expect, it } from '@jest/globals';
import { fromJson } from './settings';

describe('Settings.fromJson', () => {
  it('should successfully parse valid settings JSON', () => {
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

  it('should fail for invalid intervalType', () => {
    const jsonString = JSON.stringify({
      effectiveDate: '2023-01-15',
      intervalType: 'daily', // Invalid
      frequency: 1,
    });

    const result = fromJson(jsonString);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errors).toContain('intervalType must be one of: weekly, monthly, yearly, oneTime');
    }
  });

  it('should fail for malformed JSON', () => {
    const jsonString = '{not valid json';

    const result = fromJson(jsonString);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errors[0]).toContain('Failed to parse JSON');
    }
  });

  it('should fail for missing effectiveDate', () => {
    const jsonString = JSON.stringify({
      intervalType: 'monthly',
      frequency: 1,
    });

    const result = fromJson(jsonString);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errors).toContain('effectiveDate must be a non-empty string');
    }
  });

  it('should fail for invalid frequency', () => {
    const jsonString = JSON.stringify({
      effectiveDate: '2023-01-15',
      intervalType: 'monthly',
      frequency: 0, // Invalid: must be positive
    });

    const result = fromJson(jsonString);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errors).toContain('frequency must be a positive number');
    }
  });

  it('should fail for non-object JSON', () => {
    const jsonString = JSON.stringify('just a string');

    const result = fromJson(jsonString);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errors).toContain('Invalid JSON: expected an object');
    }
  });

  it('should accept all valid DateIntervalTypes', () => {
    const validTypes = ['weekly', 'monthly', 'yearly', 'oneTime'];

    validTypes.forEach((intervalType) => {
      const jsonString = JSON.stringify({
        effectiveDate: '2023-01-15',
        intervalType,
        frequency: 1,
      });

      const result = fromJson(jsonString);

      expect(result.isFailure).toBe(false);
    });
  });
});
