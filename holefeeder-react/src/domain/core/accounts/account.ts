import { AccountType } from '@/domain/core/accounts/account-type';
import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';
import { Validate } from '@/domain/core/validate';
import { Variation } from '@/domain/core/variation';

export type Account = {
  id: Id;
  type: AccountType;
  name: string;
  openBalance: Variation;
  openDate: string;
  description: string;
  favorite: boolean;
  inactive: boolean;
};

export const AccountErrors = {
  invalidName: 'invalid-name',
  invalidOpenBalance: 'invalid-open-balance',
  invalidOpenDate: 'invalid-open-date',
  invalidDescription: 'invalid-description',
  invalidFavorite: 'invalid-favorite',
  invalidInactive: 'invalid-inactive',
};

const schema = {
  $id: 'account-name',
  type: 'string',
  minLength: 1,
};

const schemaDescription = {
  $id: 'account-description',
  type: 'string',
};

const schemaBoolean = {
  $id: 'account-boolean',
  type: 'boolean',
};

const create = (value: Record<string, unknown>): Result<Account> => {
  return Result.combine<Account>({
    id: Id.create(value.id),
    type: AccountType.create(value.type),
    name: Validate.validateWithErrors(schema, value.name, [AccountErrors.invalidName]),
    openBalance: Variation.create(value.openBalance),
    openDate: DateOnly.create(value.openDate),
    description: Validate.validateWithErrors(schemaDescription, value.description, [AccountErrors.invalidDescription]),
    favorite: Validate.validateWithErrors(schemaBoolean, value.favorite, [AccountErrors.invalidFavorite]),
    inactive: Validate.validateWithErrors(schemaBoolean, value.inactive, [AccountErrors.invalidInactive]),
  });
};

const valid = (value: Record<string, unknown>): Account => ({
  id: Id.valid(value.id as string),
  type: AccountType.valid(value.type as string),
  name: value.name as string,
  openBalance: Variation.valid(value.openBalance as number),
  openDate: DateOnly.valid(value.openDate as string),
  description: value.description as string,
  favorite: value.favorite as boolean,
  inactive: value.inactive as boolean,
});

export const Account = {
  create: create,
  valid: valid,
};
