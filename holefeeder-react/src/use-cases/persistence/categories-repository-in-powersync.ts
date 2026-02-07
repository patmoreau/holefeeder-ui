import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { CategoriesRepository, CategoriesRepositoryErrors } from '../core/categories/categories-repository';
import { Category } from '../core/categories/category';

type CategoryRow = {
  id: number;
  type: string;
  name: string;
  color: string;
  budgetAmount: number;
  favorite: number;
  system: number;
};

export const CategoriesRepositoryInPowersync = (db: AbstractPowerSyncDatabase): CategoriesRepository => {
  const watch = (onDataChange: (result: Result<Category[]>) => void) => {
    const query = db.query<CategoryRow>({
      sql: 'SELECT id, type, name, color, budget_amount as budgetAmount, favorite, system FROM categories ORDER BY favorite DESC, name',
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.failure([CategoriesRepositoryErrors.noCategories]))
          : onDataChange(
              Result.success(
                data.map((row) =>
                  Category.valid({
                    ...row,
                    budgetAmount: Money.fromCents(row.budgetAmount),
                    favorite: row.favorite === 1,
                    system: row.system === 1,
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  return {
    watch: watch,
  };
};
