import { format, parse, startOfDay } from 'date-fns';
import { DateOnly } from '@/shared/core/date-only';

export const withDate = (date: Date | DateOnly) => {
  const fromDateOnly = (dateOnly: DateOnly): Date => {
    return parse(dateOnly, 'yyyy-MM-dd', startOfDay(new Date()));
  };

  const currentDate = date instanceof Date ? date : fromDateOnly(date);

  const toDateOnly = (transform?: (date: Date) => Date): DateOnly =>
    DateOnly.valid(format(transform ? transform(currentDate) : currentDate, 'yyyy-MM-dd'));

  const toDate = (transform?: (date: Date) => Date): Date => (transform ? transform(currentDate) : currentDate);

  return {
    toDateOnly,
    toDate,
  };
};
