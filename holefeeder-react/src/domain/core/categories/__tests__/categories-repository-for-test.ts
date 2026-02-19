import { CategoriesRepository } from '@/domain/core/categories/categories-repository';
import { Category } from '@/domain/core/categories/category';
import { type AsyncResult, Result } from '@/domain/core/result';

export type CategoriesRepositoryInMemory = CategoriesRepository & {
  add: (...items: Category[]) => void;
  isLoading: () => void;
  isFailing: (errors: string[]) => void;
};

export const CategoriesRepositoryInMemory = (): CategoriesRepositoryInMemory => {
  const itemsInMemory: Category[] = [];
  let loadingInMemory = false;
  let errorsInMemory: string[] = [];

  const watch = (onDataChange: (result: AsyncResult<Category[]>) => void) => {
    if (loadingInMemory) {
      onDataChange(Result.loading());
    } else if (errorsInMemory.length > 0) {
      onDataChange(Result.failure(errorsInMemory));
    } else {
      onDataChange(Result.success(itemsInMemory));
    }
    // Return unsubscribe function
    return () => {};
  };

  const add = (...items: Category[]) => itemsInMemory.push(...items);

  const isLoading = () => (loadingInMemory = true);

  const isFailing = (errors: string[]) => (errorsInMemory = errors);

  return { watch: watch, add: add, isLoading: isLoading, isFailing: isFailing };
};
