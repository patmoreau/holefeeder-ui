import * as Crypto from 'expo-crypto';
import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type Id = string & { readonly _id: unique symbol };

export const IdErrors = {
  invalid: 'id-invalid',
};

const schema = {
  $id: 'id',
  type: 'string',
  pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
};

const newId = (): Id => Crypto.randomUUID() as Id;

const create = (value: unknown): Result<Id> => Validate.validateWithErrors<Id>(schema, value, [IdErrors.invalid]);

const valid = (value: string): Id => value as Id;

export const Id = { newId: newId, create: create, valid: valid } as const;
