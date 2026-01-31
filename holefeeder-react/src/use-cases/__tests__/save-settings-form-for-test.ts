import { aRecentDate } from '@/__tests__/mocks/date-builder';
import { aDateIntervalType } from '@/__tests__/mocks/enum-builder';
import { aCount } from '@/__tests__/mocks/number-builder';

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
