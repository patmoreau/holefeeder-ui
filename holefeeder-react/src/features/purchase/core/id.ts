import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type Id = string & { readonly _id: unique symbol };

const schema = {
  $id: 'id',
  type: 'string',
  // GUID/UUID (versions 1-5), case-insensitive, canonical 8-4-4-4-12 format
  pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
};

const create = (value: string): Result<Id, string[]> => {
  return Validate.validate<Id>(schema, value);
};

export const Id = { create };
