import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import type { Category } from '@/domain/core/categories/category';
import { WatchCategoriesUseCase } from '@/domain/core/categories/watch-categories/watch-categories-use-case';
import { Result } from '@/domain/core/result';

export const useCategories = (): Result<Category[]> => {
  const { categoryRepository } = useRepositories();
  const [categories, setCategories] = useState<Result<Category[]>>(Result.loading());

  const useCase = useMemo(() => WatchCategoriesUseCase(categoryRepository), [categoryRepository]);

  useEffect(() => {
    const unsubscribe = useCase.query(setCategories);
    return () => unsubscribe();
  }, [useCase]);

  return categories;
};
