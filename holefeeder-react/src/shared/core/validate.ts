import Ajv, { ErrorObject } from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import { Result } from '@/shared/core/result';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

type Schema = {
  $id: string;
};

const validate = <T>(schema: Schema, value: unknown): Result<T, string[]> => {
  const validateFunction = getValidateFunctionFor(schema);

  return validateFunction(value) ? Result.success(value as T) : Result.failure(buildErrors(validateFunction.errors));
};

const getValidateFunctionFor = (schema: Schema) => {
  return ajv.getSchema(schema.$id) ?? addValidateFunction(schema);
};

const addValidateFunction = (schema: Schema) => {
  ajv.addSchema(schema, schema.$id);
  return ajv.getSchema(schema.$id)!;
};

const buildErrors = (errors: ErrorObject[] | null | undefined): string[] => {
  return (errors ?? []).map((error) => error.message ?? 'Unknown validation error');
};

export const Validate = { validate };
