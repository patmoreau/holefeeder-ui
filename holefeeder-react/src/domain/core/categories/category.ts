import { CategoryType } from '@/domain/core/categories/category-type';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { Validate } from '@/domain/core/validate';

export type Category = {
  id: Id;
  name: string;
  type: CategoryType;
  color: string;
  budgetAmount: Money;
  favorite: boolean;
  system: boolean;
};

export const CategoryErrors = {
  invalidName: 'invalid-name',
  invalidColor: 'invalid-color',
  invalidBudgetAmount: 'invalid-budget-amount',
  invalidFavorite: 'invalid-favorite',
  invalidSystem: 'invalid-system',
};

const schema = {
  $id: 'category-name',
  type: 'string',
  minLength: 1,
};

const schemaColor = {
  $id: 'category-color',
  type: 'string',
  minLength: 1,
};

const schemaBoolean = {
  $id: 'category-boolean',
  type: 'boolean',
};

const create = (value: Record<string, unknown>): Result<Category> =>
  Result.combine<Category>({
    id: Id.create(value.id),
    type: CategoryType.create(value.type),
    name: Validate.validateWithErrors(schema, value.name, [CategoryErrors.invalidName]),
    color: Validate.validateWithErrors(schemaColor, value.color, [CategoryErrors.invalidColor]),
    budgetAmount: Money.create(value.budgetAmount),
    favorite: Validate.validateWithErrors(schemaBoolean, value.favorite, [CategoryErrors.invalidFavorite]),
    system: Validate.validateWithErrors(schemaBoolean, value.system, [CategoryErrors.invalidSystem]),
  });

const valid = (value: Record<string, unknown>): Category => ({
  id: Id.valid(value.id as string),
  type: CategoryType.valid(value.type as string),
  name: value.name as string,
  color: value.color as string,
  budgetAmount: Money.valid(value.budgetAmount as number),
  favorite: value.favorite as boolean,
  system: value.system as boolean,
});

export const Category = {
  create: create,
  valid: valid,
};
