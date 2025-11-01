import { withDate } from '@/features/shared/utils/with-date';

describe('with-date', () => {
  describe('toDateOnly', () => {
    it('returns date in YYYY-MM-DD format', () => {
      const date = new Date(2025, 6, 13);
      expect(withDate(date).toDateOnly()).toBe('2025-07-13');
    });
  });
});
