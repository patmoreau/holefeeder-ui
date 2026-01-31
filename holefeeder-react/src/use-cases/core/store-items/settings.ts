import { withDate } from '@/features/shared/utils/with-date';
import { DateIntervalType, DateIntervalTypes } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export const SETTINGS_CODE = 'settings';

export type Settings = {
  effectiveDate: DateOnly;
  intervalType: DateIntervalType;
  frequency: number;
};

export const DefaultSettings: Settings = {
  effectiveDate: DateOnly.valid(withDate(new Date()).toDateOnly()),
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

const create = (value: Record<string, unknown>): Result<Settings> =>
  Result.combine<Settings>({
    effectiveDate: DateOnly.create(value.effectiveDate),
    intervalType: DateIntervalType.create(value.intervalType),
    frequency: Validate.validate<number>(schema, value.frequency),
  });

const toStoreItemData = (settings: Settings): string => JSON.stringify(settings);

export const Settings = {
  create: create,
  toStoreItemData: toStoreItemData,
};
