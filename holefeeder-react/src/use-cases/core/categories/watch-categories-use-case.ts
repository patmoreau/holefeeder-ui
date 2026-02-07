import { Result } from '@/shared/core/result';
import { CategoriesRepository } from './categories-repository';
import { Category } from './category';

export const WatchCategoriesUseCase = (repository: CategoriesRepository) => {
  const query = (onDataChange: (result: Result<Category[]>) => void) =>
    repository.watch((result: Result<Category[]>) => {
      if (result.isLoading || result.isFailure) {
        onDataChange(result);
        return;
      }

      onDataChange(result);
    });

  return {
    query: query,
  };
};
