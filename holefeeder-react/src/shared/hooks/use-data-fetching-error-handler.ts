import { UseQueryResult } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorKey } from '@/features/shared/core/error-key';
import { isNetworkError } from '@/shared/utils/is-network-error';

type AnyQueryResult = UseQueryResult<any, unknown>;

export function useDataFetchingErrorHandler<T extends AnyQueryResult[]>(...queries: T) {
  const [showError, setShowError] = useState(false);

  const isLoading = useMemo(() => queries.some((q) => q.isLoading), [queries]);
  const isError = useMemo(() => queries.some((q) => q.isError), [queries]);
  const errors = useMemo(() => queries.map((q) => q.error).filter(Boolean), [queries]);

  const allQueriesHaveData = useMemo(() => queries.every((q) => q.data !== undefined), [queries]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  const hasNetworkIssue = useMemo(() => errors.some(isNetworkError), [errors]);

  const onRetry = useCallback(() => {
    setShowError(false);
    queries.forEach((query) => {
      void query.refetch();
    });
  }, [queries]);

  const errorSheetProps = {
    showError,
    setShowError,
    error: hasNetworkIssue ? ErrorKey.noInternetConnection : ErrorKey.cannotReachServer,
    onRetry,
  };

  const data = !isLoading && !isError && allQueriesHaveData ? (queries.map((q) => q.data) as { [K in keyof T]: T[K]['data'] }) : null;

  return {
    isLoading: isLoading || !allQueriesHaveData,
    data,
    errorSheetProps,
  };
}
