import { usePowerSync } from '@powersync/react-native';
import { useEffect, useMemo, useState } from 'react';
import { Result } from '@/shared/core/result';
import type { Category } from '@/use-cases/core/categories/category';
import { WatchCategoriesUseCase } from '@/use-cases/core/categories/watch-categories-use-case';
import { CategoriesRepositoryInPowersync } from '@/use-cases/persistence/categories-repository-in-powersync';

export const useCategories = (): Result<Category[]> => {
  const db = usePowerSync();
  const [categories, setCategories] = useState<Result<Category[]>>(Result.loading());

  const useCase = useMemo(() => WatchCategoriesUseCase(CategoriesRepositoryInPowersync(db)), [db]);

  useEffect(() => {
    const unsubscribe = useCase.query(setCategories);
    return () => unsubscribe();
  }, [useCase]);

  return categories;
};
