import { useEffect, useState } from 'react';
import { ErrorKey } from '@/shared/core/error-key';
import { Result } from '@/shared/core/result';

type WatchHook<T> = () => Result<T>;

type WatchHooks = Record<string, WatchHook<any>>;

type MultiWatchResult<T extends WatchHooks> = {
  data: { [K in keyof T]: T[K] extends WatchHook<infer R> ? R : never } | null;
  isLoading: boolean;
  errors: {
    showError: boolean;
    setShowError: (show: boolean) => void;
    error: ErrorKey;
  };
  results: { [K in keyof T]: Result<any> };
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

  const data =
    hasErrors || isLoading
      ? null
      : Object.entries(results).reduce((acc, [key, result]: [string, any]) => {
          acc[key] = result.value;
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
