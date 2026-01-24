export type Result<T> = Success<T> | Failure;

export type Success<T> = {
  readonly isFailure: false;
  readonly value: T;
};

export type Failure = {
  readonly isFailure: true;
  readonly errors: string[];
};

const success = <T>(value: T): Success<T> => ({ isFailure: false, value });

const failure = (errors: string[]): Failure => ({ isFailure: true, errors });

const combine = <T extends Record<string, unknown>>(results: {
  [K in keyof T]: Result<T[K]>;
}) => {
  let failures: string[] = [];
  const combined = {} as T;
  for (const [key, result] of Object.entries(results)) {
    if (result.isFailure) {
      failures = failures.concat(result.errors);
    } else {
      combined[key as keyof T] = result.value;
    }
  }
  return failures.length > 0 ? failure(failures) : success(combined);
};

const combineArray = <T>(results: Result<T>[]): Result<T[]> => {
  const failures: string[] = [];
  const values: T[] = [];

  for (const result of results) {
    if (result.isFailure) {
      failures.push(...result.errors);
    } else {
      values.push(result.value);
    }
  }

  return failures.length > 0 ? failure(failures) : success(values);
};

export const Result = { success: success, failure: failure, combine: combine, combineArray: combineArray } as const;
