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

export const Result = { success: success, failure: failure } as const;
