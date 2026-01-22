import { Category } from '@/core/category';
import { normalizeCategoryType } from '@/core/category-type';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
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
  system: number;
};

export const useCategories = (): UseCategoriesResult => {
  return usePowerSyncWatchedQuery<CategoryRow, Category>(
    'purchase-use-categories',
    'SELECT id, type, name, color, budget_amount, favorite FROM categories ORDER BY favorite DESC, name',
    [],
    (row) => ({
      id: Id.valid(row.id),
      type: normalizeCategoryType(row.type),
      name: row.name,
      color: row.color,
      budgetAmount: Money.valid(row.budget_amount / 100),
      favorite: row.favorite === 1,
      system: row.system === 1,
    })
  );
};
