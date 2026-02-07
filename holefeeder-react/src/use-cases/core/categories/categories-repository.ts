import { Result } from '@/shared/core/result';
import { Category } from './category';

export type CategoriesRepository = {
  watch: (onDataChange: (result: Result<Category[]>) => void) => () => void;
};

export const CategoriesRepositoryErrors = {
  noCategories: 'no-categories',
};
