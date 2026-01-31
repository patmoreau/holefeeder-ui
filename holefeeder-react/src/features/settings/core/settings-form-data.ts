import { DateIntervalType } from '@/shared/core/date-interval-type';

export type SettingsFormData = {
  effectiveDate: string;
  intervalType: DateIntervalType;
  frequency: number;
};
