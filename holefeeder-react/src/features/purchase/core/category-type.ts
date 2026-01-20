export const CategoryType = {
  expense: 'expense',
  gain: 'gain',
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const normalizeCategoryType = (type: string): CategoryType => {
  const normalized = type.trim().toLowerCase();
  if (normalized === 'expense') return CategoryType.expense;
  if (normalized === 'gain') return CategoryType.gain;
  return CategoryType.expense;
};
