import { useEffect, useState } from 'react';
import { ErrorKey } from '@/domain/core/error-key';
import { type AsyncResult } from '@/domain/core/result';

type WatchHook<T, TDefault extends T | null | undefined = undefined> = {
  (): AsyncResult<T>;
  defaultValue?: TDefault;
};

type WatchHooks = Record<string, WatchHook<any, any>>;

type WatchHookValue<H> =
  H extends WatchHook<infer R, infer D> ? (D extends NonNullable<D> ? R : D extends null ? R | null : R | undefined) : never;

type MultiWatchResult<T extends WatchHooks> = {
  data: { [K in keyof T]: WatchHookValue<T[K]> };
  isLoading: boolean;
  errors: {
    showError: boolean;
    setShowError: (show: boolean) => void;
    error: ErrorKey;
  };
  results: { [K in keyof T]: AsyncResult<any> };
};

export const withDefault = <T>(hook: () => AsyncResult<T>, defaultValue: T): WatchHook<T, T> => {
  const wrapped = () => hook();
  (wrapped as any).defaultValue = defaultValue;
  return wrapped as WatchHook<T, T>;
};

export const useMultipleWatches = <T extends WatchHooks>(hooks: T): MultiWatchResult<T> => {
  const [showError, setShowError] = useState(false);

  const results = Object.entries(hooks).reduce((acc, [key, hook]) => {
    acc[key] = hook();
    return acc;
  }, {} as any);

  const isLoading = Object.values(results).some((r: any) => r.isLoading);

  const errors = Object.values(results).flatMap((r: any) => (r.isFailure ? r.errors : []));
  if (errors.length > 0) console.error(errors);

  const hasErrors = errors.length > 0;

  useEffect(() => {
    if (hasErrors) {
      setShowError(true);
    }
  }, [hasErrors]);

  const data = Object.entries(results).reduce((acc, [key, result]: [string, any]) => {
    const hook = hooks[key];
    const hasDefault = 'defaultValue' in hook;
    acc[key] = result.isSuccess ? result.value : hasDefault ? (hook as any).defaultValue : undefined;
    return acc;
  }, {} as any);

  return {
    data,
    isLoading: isLoading,
    errors: {
      showError,
      setShowError,
      error: ErrorKey.saveFailed,
    },
    results,
  };
};
