import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import type { Category } from '@/domain/core/categories/category';
import { WatchCategoriesUseCase } from '@/domain/core/categories/watch-categories/watch-categories-use-case';
import { type AsyncResult, Result } from '@/domain/core/result';

export const useCategories = (): AsyncResult<Category[]> => {
  const { categoryRepository } = useRepositories();
  const [categories, setCategories] = useState<AsyncResult<Category[]>>(Result.loading());

  const useCase = useMemo(() => WatchCategoriesUseCase(categoryRepository), [categoryRepository]);

  useEffect(() => {
    const unsubscribe = useCase.query(setCategories);
    return () => unsubscribe();
  }, [useCase]);

  return categories;
};
