import { UseQueryResult } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorKey } from '@/features/shared/core/error-key';
import { UseQueryResult as LocalUseQueryResult } from '@/shared/hooks/use-query-result';
import { isNetworkError } from '@/shared/utils/is-network-error';

type AnyQueryResult = UseQueryResult<any, unknown> | LocalUseQueryResult<any>;

// Overload for single query - returns unwrapped data
export function useDataFetchingErrorHandler<T extends AnyQueryResult>(
  query: T
): {
  isLoading: boolean;
  data: T['data'] | null;
  errorSheetProps: {
    showError: boolean;
    setShowError: (show: boolean) => void;
    error: ErrorKey;
    onRetry: () => void;
  };
};

// Overload for multiple queries - returns tuple of data
export function useDataFetchingErrorHandler<T extends AnyQueryResult[]>(
  ...queries: T
): {
  isLoading: boolean;
  data: { [K in keyof T]: T[K]['data'] } | null;
  errorSheetProps: {
    showError: boolean;
    setShowError: (show: boolean) => void;
    error: ErrorKey;
    onRetry: () => void;
  };
};

// Implementation
export function useDataFetchingErrorHandler<T extends AnyQueryResult | AnyQueryResult[]>(
  ...queries: T extends AnyQueryResult ? [T] : T extends AnyQueryResult[] ? T : never
) {
  const [showError, setShowError] = useState(false);

  const queryArray = queries as AnyQueryResult[];
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

  const onRetry = useCallback(() => {
    setShowError(false);
    queryArray.forEach((query) => {
      void query.refetch();
    });
  }, [queryArray]);

  const errorSheetProps = {
    showError,
    setShowError,
    error: hasNetworkIssue ? ErrorKey.noInternetConnection : ErrorKey.cannotReachServer,
    onRetry,
  };

  const data =
    !isLoading && !isError && allQueriesHaveData ? (isSingleQuery ? queryArray[0].data : (queryArray.map((q) => q.data) as any)) : null;

  return {
    isLoading: isLoading || !allQueriesHaveData,
    data,
    errorSheetProps,
  };
}
