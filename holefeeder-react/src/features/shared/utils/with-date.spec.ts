import { addMonths } from 'date-fns';
import { DateOnly } from '@/domain/core/date-only';
import { withDate } from '@/features/shared/utils/with-date';

describe('with-date', () => {
  describe('toDateOnly', () => {
    it('accepts Date', () => {
      const date = new Date(2025, 6, 13);
      expect(withDate(date).toDateOnly()).toBe('2025-07-13');
    });

    it('accepts DateOnly', () => {
      const date = DateOnly.valid('2025-07-13');
      expect(withDate(date).toDateOnly()).toBe(date);
    });

    it('transforms the date when a transform function is provided', () => {
      const date = new Date(2025, 6, 13);
      const transform = (d: Date) => addMonths(d, 1);
      expect(withDate(date).toDateOnly(transform)).toBe('2025-08-13');
    });
  });

  describe('toDate', () => {
    it('accepts Date', () => {
      const date = new Date(2025, 6, 13);
      expect(withDate(date).toDate()).toBe(date);
    });

    it('accepts DateOnly', () => {
      const dateString = '2025-07-13';
      const date = DateOnly.valid(dateString);
      const expected = new Date(2025, 6, 13);
      expect(withDate(date).toDate()).toEqual(expected);
    });

    it('transforms the date when a transform function is provided', () => {
      const date = new Date(2025, 6, 13);
      const transform = (d: Date) => addMonths(d, 1);
      expect(withDate(date).toDate(transform)).toEqual(new Date(2025, 7, 13));
    });
  });
});
