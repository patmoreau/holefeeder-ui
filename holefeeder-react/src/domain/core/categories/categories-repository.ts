import { type AsyncResult } from '@/domain/core/result';
import { Category } from './category';

export type CategoriesRepository = {
  watch: (onDataChange: (result: AsyncResult<Category[]>) => void) => () => void;
};

export const CategoriesRepositoryErrors = {
  noCategories: 'no-categories',
};
