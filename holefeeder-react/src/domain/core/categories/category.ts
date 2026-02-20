import { CategoryType } from '@/domain/core/categories/category-type';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { Validate, Validator } from '@/domain/core/validate';

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

const isValidName = Validator.string({ minLength: 1 });
const isValidColor = Validator.string({ minLength: 1 });
const isValidBoolean = Validator.boolean();

const create = (value: Record<string, unknown>): Result<Category> =>
  Result.combine<Category>({
    id: Id.create(value.id),
    type: CategoryType.create(value.type),
    name: Validate.validate(isValidName, value.name, [CategoryErrors.invalidName]),
    color: Validate.validate(isValidColor, value.color, [CategoryErrors.invalidColor]),
    budgetAmount: Money.create(value.budgetAmount),
    favorite: Validate.validate(isValidBoolean, value.favorite, [CategoryErrors.invalidFavorite]),
    system: Validate.validate(isValidBoolean, value.system, [CategoryErrors.invalidSystem]),
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
