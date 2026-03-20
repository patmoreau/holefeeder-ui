import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { aDateIntervalType } from '@/__tests__/mocks/enum-for-test';
import { aCount } from '@/__tests__/mocks/number-for-test';

const defaultSaveSettingsForm = (): Record<string, unknown> => ({
  effectiveDate: aRecentDate(),
  intervalType: aDateIntervalType(),
  frequency: aCount() + 1,
});

export const aSaveSettingsForm = (overrides?: Record<string, unknown>): Record<string, unknown> => {
  return {
    ...defaultSaveSettingsForm(),
    ...overrides,
  };
};
