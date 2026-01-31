export type Result<T> = Success<T> | Failure | Loading;

export type Success<T> = {
  readonly isFailure: false;
  readonly isLoading: false;
  readonly value: T;
};

export type Failure = {
  readonly isFailure: true;
  readonly isLoading: false;
  readonly errors: string[];
};

export type Loading = {
  readonly isFailure: false;
  readonly isLoading: true;
};

const success = <T>(value: T): Success<T> => ({ isFailure: false, isLoading: false, value });

const failure = (errors: string[]): Failure => ({ isFailure: true, isLoading: false, errors });

const loading = (): Loading => ({ isFailure: false, isLoading: true });

const combine = <T extends Record<string, unknown>>(results: {
  [K in keyof T]: Result<T[K]>;
}) => {
  let loadings: Loading[] = [];
  let failures: string[] = [];
  const combined = {} as T;
  for (const [key, result] of Object.entries(results)) {
    if (result.isLoading) {
      loadings.push(result);
    } else if (result.isFailure) {
      failures = failures.concat(result.errors);
    } else {
      combined[key as keyof T] = result.value;
    }
  }

  if (loadings.length > 0) return loading();
  return failures.length > 0 ? failure(failures) : success(combined);
};

const combineArray = <T>(results: Result<T>[]): Result<T[]> => {
  let loadings: Loading[] = [];
  const failures: string[] = [];
  const values: T[] = [];

  for (const result of results) {
    if (result.isLoading) {
      loadings.push(result);
    } else if (result.isFailure) {
      failures.push(...result.errors);
    } else {
      values.push(result.value);
    }
  }

  if (loadings.length > 0) return loading();
  return failures.length > 0 ? failure(failures) : success(values);
};

const isSuccess = <T>(result: Result<T>): result is Success<T> => !result.isLoading && !result.isFailure;

const isFailure = <T>(result: Result<T>): result is Failure => result.isFailure;

const isLoading = <T>(result: Result<T>): result is Loading => result.isLoading;

export const Result = {
  success: success,
  failure: failure,
  loading: loading,
  combine: combine,
  combineArray: combineArray,
  isSuccess: isSuccess,
  isFailure: isFailure,
  isLoading: isLoading,
} as const;
