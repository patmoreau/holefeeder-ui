import * as Crypto from 'expo-crypto';
import { Result } from '@/domain/core/result';
import { Validate, Validator } from '@/domain/core/validate';

export type Id = string & { readonly _id: unique symbol };

export const IdErrors = {
  invalid: 'id-invalid',
};

const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const isValidPattern = Validator.pattern<Id>({ pattern: UUID_PATTERN });

const newId = (): Id => Crypto.randomUUID() as Id;

const create = (value: unknown): Result<Id> => Validate.validate<Id>(isValidPattern, value, [IdErrors.invalid]);

const valid = (value: string): Id => value as Id;

export const Id = { newId: newId, create: create, valid: valid } as const;
