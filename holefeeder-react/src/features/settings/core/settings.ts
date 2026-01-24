import { withDate } from '@/features/shared/utils/with-date';
import { DateIntervalType, DateIntervalTypes } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type Settings = {
  storeItemId?: string;
  effectiveDate: string;
  intervalType: DateIntervalType;
  frequency: number;
};

export const DefaultSettings: Settings = {
  effectiveDate: withDate(new Date()).toDateOnly(),
  intervalType: DateIntervalTypes.monthly,
  frequency: 1,
} as const;

export const SettingsErrors = {
  invalid: 'settings-invalid',
};

const schema = {
  $id: 'frequency',
  type: 'number',
  minimum: 1,
};

export const fromJson = (jsonString: string): Result<Settings> => {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return Result.failure([SettingsErrors.invalid]);
    }

    const result = Result.combine<Settings>({
      effectiveDate: DateOnly.create(parsed.effectiveDate),
      intervalType: DateIntervalType.create(parsed.intervalType),
      frequency: Validate.validate<number>(schema, parsed.frequency),
    });

    if (result.isFailure) return result;

    return result;
  } catch {
    return Result.failure([SettingsErrors.invalid]);
  }
};
