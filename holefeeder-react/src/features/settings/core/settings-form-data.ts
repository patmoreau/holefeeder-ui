import { DateIntervalType } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';

export type SettingsFormData = {
  effectiveDate: DateOnly;
  intervalType: DateIntervalType;
  frequency: number;
};
