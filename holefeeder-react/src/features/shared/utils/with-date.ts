export const withDate = (date: Date) => {
  const toDateOnly = () => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    toDateOnly,
  };
};

/**
 * Creates a Date object from a date string (YYYY-MM-DD) in local timezone,
 * disregarding any timezone conversions.
 */
export const fromDateOnly = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
