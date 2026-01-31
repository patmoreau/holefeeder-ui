import { usePowerSync } from '@powersync/react-native';
import { useCallback, useEffect, useState } from 'react';
import { UseQueryResult } from '@/use-cases/hooks/use-queries-handler';

export const usePowerSyncWatchedQuery = <T, R = T>(
  queryName: string,
  sql: string,
  params: any[] = [],
  mapFn?: (data: T) => R
): UseQueryResult<R[]> & { refetch: () => Promise<void> } => {
  const db = usePowerSync();
  const [data, setData] = useState<R[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await db.getAll<T>(sql, params);
      let processedData = mapFn ? result.map(mapFn) : (result as unknown as R[]);
      setData(processedData);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Query failed'));
      console.error(`[${queryName}] query error:`, e);
    } finally {
      setIsLoading(false);
    }
  }, [db, sql, params, mapFn, queryName]);

  useEffect(() => {
    const abortController = new AbortController();

    const watch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        for await (const result of db.watch(sql, params, { signal: abortController.signal })) {
          const startTime = __DEV__ ? performance.now() : 0;
          const rows = result.rows?._array || [];
          let processedData = mapFn ? rows.map(mapFn) : (rows as unknown as R[]);
          setData(processedData);
          setIsLoading(false);

          if (__DEV__) {
            const duration = performance.now() - startTime;
            console.log(`[${queryName}] Query executed`, {
              rowCount: rows.length,
              duration: `${duration.toFixed(2)}ms`,
            });
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        setError(e instanceof Error ? e : new Error('Watch failed'));
        console.error(`[${queryName}] watch error:`, e);
        setIsLoading(false);
      }
    };

    watch();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, sql, JSON.stringify(params), queryName]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch: async () => {
      // Re-triggering the watch is not straightforward with just a function call unless we change the key,
      // but db.watch auto-updates.
      // For manual refresh compatibility, we can just do a single fetch, although watch *should* handle it.
      // However, to satisfy the type interface, we provide a no-op or a one-off fetch.
      // Ideally, specific re-fetch isn't needed with watch. We'll provide a manual fetch just in case.
      await fetch();
    },
  };
};
