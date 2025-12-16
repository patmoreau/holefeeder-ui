export const CategoryType = {
  expense: 'expense',
  gain: 'gain',
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];
