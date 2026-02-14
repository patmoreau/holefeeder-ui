import { Result } from '@/domain/core/result';
import { Category } from './category';

export type CategoriesRepository = {
  watch: (onDataChange: (result: Result<Category[]>) => void) => () => void;
};

export const CategoriesRepositoryErrors = {
  noCategories: 'no-categories',
};
