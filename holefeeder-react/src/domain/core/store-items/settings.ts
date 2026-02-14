import { DateIntervalType, DateIntervalTypes } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { Result } from '@/domain/core/result';
import { Validate } from '@/domain/core/validate';
import { withDate } from '@/features/shared/utils/with-date';

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
