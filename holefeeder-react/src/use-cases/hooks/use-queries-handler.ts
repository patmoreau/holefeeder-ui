import { useEffect, useMemo, useState } from 'react';
import { ErrorKey } from '@/shared/core/error-key';
import { isNetworkError } from '@/shared/utils/is-network-error';

export type UseQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

// Overload for single query - returns unwrapped data
export function useQueriesHandler<T>(query: UseQueryResult<T>): {
  isLoading: boolean;
  data: T | null;
  errorSheetProps: {
    showError: boolean;
    setShowError: (show: boolean) => void;
    error: ErrorKey;
  };
};

// Overload for multiple queries - returns tuple of data
export function useQueriesHandler<T extends readonly UseQueryResult<any>[]>(
  ...queries: T
): {
  isLoading: boolean;
  data: { [K in keyof T]: T[K] extends UseQueryResult<infer U> ? U : never } | null;
  errorSheetProps: {
    showError: boolean;
    setShowError: (show: boolean) => void;
    error: ErrorKey;
  };
};

// Implementation
export function useQueriesHandler<T>(...queries: UseQueryResult<any>[] | [UseQueryResult<T>]) {
  const [showError, setShowError] = useState(false);

  const queryArray = queries as UseQueryResult<any>[];
  const isSingleQuery = queryArray.length === 1;

  const isLoading = useMemo(() => queryArray.some((q) => q.isLoading), [queryArray]);
  const isError = useMemo(() => queryArray.some((q) => q.isError), [queryArray]);
  const errors = useMemo(() => queryArray.map((q) => q.error).filter(Boolean), [queryArray]);

  const allQueriesHaveData = useMemo(() => queryArray.every((q) => q.data !== undefined), [queryArray]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  const hasNetworkIssue = useMemo(() => errors.some(isNetworkError), [errors]);

  const errorSheetProps = {
    showError,
    setShowError,
    error: hasNetworkIssue ? ErrorKey.noInternetConnection : ErrorKey.cannotReachServer,
  };

  const data =
    !isLoading && !isError && allQueriesHaveData ? (isSingleQuery ? queryArray[0].data : (queryArray.map((q) => q.data) as any)) : null;

  return {
    isLoading: isLoading || !allQueriesHaveData,
    data,
    errorSheetProps,
  };
}
