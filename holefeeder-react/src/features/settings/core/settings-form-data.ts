import { DateIntervalType } from '@/shared/core/date-interval-type';

export type SettingsFormData = {
  storeItemId?: string;
  effectiveDate: string;
  intervalType: DateIntervalType;
  frequency: number;
};
