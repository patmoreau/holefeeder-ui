import { aPastDate } from '@/__tests__/mocks/date-builder';
import { aDateIntervalType } from '@/__tests__/mocks/enum-builder';
import { aCount } from '@/__tests__/mocks/number-builder';
import { Settings } from '@/use-cases/core/store-items/settings';

const defaultSettings = (): Settings => ({
  effectiveDate: aPastDate(),
  intervalType: aDateIntervalType(),
  frequency: aCount() + 1,
});

export const aSettings = (overrides?: Partial<Settings>): Settings => ({
  ...defaultSettings(),
  ...overrides,
});
