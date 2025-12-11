import { DateIntervalType } from '@/features/shared/core/date-interval-type';
import { withDate } from '@/features/shared/utils/with-date';
import { Result } from '@/shared/core/result';

export type Settings = {
  effectiveDate: string;
  intervalType: DateIntervalType;
  frequency: number;
};

export const DefaultSettings: Settings = {
  effectiveDate: withDate(new Date()).toDateOnly(),
  intervalType: DateIntervalType.monthly,
  frequency: 1,
} as const;

const isValidDateIntervalType = (value: unknown): value is DateIntervalType => {
  return typeof value === 'string' && Object.values(DateIntervalType).includes(value as DateIntervalType);
};

export const fromJson = (jsonString: string): Result<Settings> => {
  try {
    const parsed = JSON.parse(jsonString);

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      return Result.failure(['Invalid JSON: expected an object']);
    }

    const errors: string[] = [];

    // Validate effectiveDate
    if (typeof parsed.effectiveDate !== 'string' || parsed.effectiveDate.trim() === '') {
      errors.push('effectiveDate must be a non-empty string');
    }

    // Validate intervalType
    if (!isValidDateIntervalType(parsed.intervalType)) {
      errors.push(`intervalType must be one of: ${Object.values(DateIntervalType).join(', ')}`);
    }

    // Validate frequency
    if (typeof parsed.frequency !== 'number' || parsed.frequency < 1) {
      errors.push('frequency must be a positive number');
    }

    if (errors.length > 0) {
      return Result.failure(errors);
    }

    return Result.success({
      effectiveDate: parsed.effectiveDate,
      intervalType: parsed.intervalType,
      frequency: parsed.frequency,
    });
  } catch (error) {
    return Result.failure([`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`]);
  }
};
