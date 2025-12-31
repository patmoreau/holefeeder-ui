import { fromDateOnly, withDate } from '@/features/shared/utils/with-date';

describe('with-date', () => {
  describe('toDateOnly', () => {
    it('returns date in YYYY-MM-DD format', () => {
      const date = new Date(2025, 6, 13);
      expect(withDate(date).toDateOnly()).toBe('2025-07-13');
    });
  });

  describe('fromDateOnly', () => {
    it('creates a date from YYYY-MM-DD string in local timezone', () => {
      const date = fromDateOnly('2025-07-13');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(6); // 0-indexed
      expect(date.getDate()).toBe(13);
    });

    it('round-trips correctly with toDateOnly', () => {
      const dateString = '2025-12-31';
      const date = fromDateOnly(dateString);
      expect(withDate(date).toDateOnly()).toBe(dateString);
    });
  });
});
