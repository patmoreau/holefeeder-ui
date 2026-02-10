import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { Money } from '@/shared/core/money';
import { Category } from '@/use-cases/core/categories/category';
import { aCategoryType } from '../mocks/enum-builder';
import { aColor, anId, aString } from '../mocks/string-builder';

export type CategoryForTest = Category & {
  times: (count: number) => CategoryForTest[];
  store: (db: AbstractPowerSyncDatabase) => Promise<CategoryForTest>;
  remove: (db: AbstractPowerSyncDatabase) => Promise<void>;
};

const defaultCategory = (): Category => ({
  id: anId(),
  type: aCategoryType(),
  name: aString(),
  color: aColor(),
  budgetAmount: Money.ZERO,
  favorite: false,
  system: false,
});

const times = (count: number, overrides?: Partial<Category>): CategoryForTest[] => Array.from({ length: count }, () => aCategory(overrides));

const store = async (db: AbstractPowerSyncDatabase, category: CategoryForTest): Promise<CategoryForTest> => {
  const result = await db.execute(
    'INSERT INTO categories (id, type, name, color, budget_amount, favorite, system, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      category.id,
      category.type,
      category.name,
      category.color,
      Money.toCents(category.budgetAmount),
      category.favorite ? 1 : 0,
      category.system ? 1 : 0,
      anId(),
    ]
  );
  return category;
};

const remove = async (db: AbstractPowerSyncDatabase, category: Category): Promise<void> => {
  await db.execute('DELETE FROM categories WHERE id = ?', [category.id]);
};

export const aCategory = (overrides?: Partial<Category>): CategoryForTest => {
  const categoryForTest: CategoryForTest = {
    ...defaultCategory(),
    ...overrides,
    times: (count: number) => times(count, overrides),
    store: (db: AbstractPowerSyncDatabase) => store(db, categoryForTest),
    remove: (db: AbstractPowerSyncDatabase) => remove(db, categoryForTest),
  };
  return categoryForTest;
};

export const toCategory = ({ times, store, remove, ...category }: CategoryForTest): Category => category;
