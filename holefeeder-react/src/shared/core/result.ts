export type Result<T, E> = Success<T> | Failure<E>;

export type Success<T> = {
  readonly isFailure: false;
  readonly value: T;
};

export type Failure<E> = {
  readonly isFailure: true;
  readonly error: E;
};

const success = <T>(value: T): Success<T> => ({ isFailure: false, value });

const failure = <E>(error: E): Failure<E> => ({ isFailure: true, error });

export const Result = { success, failure } as const;
