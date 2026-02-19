import { type AsyncResult } from '@/domain/core/result';
import { CategoriesRepository } from '../categories-repository';
import { Category } from '../category';

export const WatchCategoriesUseCase = (repository: CategoriesRepository) => {
  const query = (onDataChange: (result: AsyncResult<Category[]>) => void) =>
    repository.watch((result: AsyncResult<Category[]>) => {
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
