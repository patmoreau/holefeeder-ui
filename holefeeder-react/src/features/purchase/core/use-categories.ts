import { Category } from '@/features/purchase/core/category';
import { normalizeCategoryType } from '@/features/purchase/core/category-type';
import { Id } from '@/features/purchase/core/id';
import { usePowerSyncWatchedQuery } from '@/shared/hooks/use-powersync-watched-query';
import { UseQueryResult } from '@/shared/hooks/use-query-result';

type UseCategoriesResult = UseQueryResult<Category[]>;

type CategoryRow = {
  id: string;
  type: string;
  name: string;
  color: string;
  budget_amount: number;
  favorite: number;
};

export const useCategories = (): UseCategoriesResult => {
  return usePowerSyncWatchedQuery<CategoryRow, Category>(
    'purchase-use-categories',
    'SELECT id, type, name, color, budget_amount, favorite FROM categories ORDER BY favorite DESC, name',
    [],
    (row) => ({
      id: row.id as Id,
      type: normalizeCategoryType(row.type),
      name: row.name,
      color: row.color,
      budgetAmount: row.budget_amount,
      favorite: row.favorite === 1,
    })
  );
};
