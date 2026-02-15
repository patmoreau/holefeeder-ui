import { aPastDate } from '@/__tests__/mocks/date-for-test';
import { aDateIntervalType } from '@/__tests__/mocks/enum-for-test';
import { aCount } from '@/__tests__/mocks/number-for-test';
import { Settings } from '@/domain/core/store-items/settings';

const defaultSettings = (): Settings => ({
  effectiveDate: aPastDate(),
  intervalType: aDateIntervalType(),
  frequency: aCount() + 1,
});

export const aSettings = (overrides?: Partial<Settings>): Settings => ({
  ...defaultSettings(),
  ...overrides,
});
