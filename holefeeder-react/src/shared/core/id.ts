import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type Id = string & { readonly _id: unique symbol };

export const IdErrors = {
  invalid: 'id-invalid',
};

const schema = {
  $id: 'id',
  type: 'string',
  pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
};

const create = (value: string): Result<Id> => {
  return Validate.validateWithErrors<Id>(schema, value, [IdErrors.invalid]);
};

const valid = (value: string): Id => value as Id;

export const Id = { create: create, valid: valid } as const;
