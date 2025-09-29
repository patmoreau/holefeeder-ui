type Success<T> = { isFailure: false; value: T };
type Failure<E> = { isFailure: true; error: E };

type Result<T, E> = Success<T> | Failure<E>;

const success = <T>(value: T): Success<T> => ({
  isFailure: false,
  value,
});

const failure = <E>(error: E): Failure<E> => ({
  isFailure: true,
  error,
});

export const Result = {
  success,
  failure,
};
