import { Result } from '@/shared/core/result';

export const readEnvVariable = (key: string): Result<string> => {
  // eslint-disable-next-line expo/no-dynamic-env-var
  const value = process.env[key];
  if (value === undefined || value === '') return Result.failure([`env-variable-${key}-not-found`]);
  return Result.success(value);
};

export const EnvVariable = { read: readEnvVariable };
