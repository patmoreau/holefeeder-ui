import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Result } from '@/shared/core/result';
import type { Category } from '@/use-cases/core/categories/category';
import { WatchCategoriesUseCase } from '@/use-cases/core/categories/watch-categories-use-case';

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
