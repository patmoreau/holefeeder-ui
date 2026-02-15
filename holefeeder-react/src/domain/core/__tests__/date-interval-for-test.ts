import { aPastDate, aRecentDate } from '@/__tests__/mocks/date-for-test';
import { DateInterval } from '@/domain/core/date-interval';

const defaultDateInterval = (): DateInterval => ({
  start: aPastDate(),
  end: aRecentDate(),
});

export const aDateInterval = (overrides?: Partial<DateInterval>): DateInterval => ({
  ...defaultDateInterval(),
  ...overrides,
});
