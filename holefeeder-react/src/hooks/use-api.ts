import { useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiService } from '@/services';
import { Result, getAxiosErrorMessage } from '@/utils';

export const useApi = () => {
  const { tokenInfo, isLoading, isReady } = useAuth();

  // Memoize the client so it only recreates when token changes
  const client = useMemo(() => {
    return apiService(tokenInfo.accessToken);
  }, [tokenInfo.accessToken]);

  // Memoize the API methods
  const getCategories = useCallback(async () => {
    if (!isReady) {
      return Result.failure('Authentication not ready');
    }

    try {
      const res = await client.getCategories();
      if (res.status === 200) {
        return Result.success(res.data);
      }
      return Result.failure(res.statusText);
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      return Result.failure(errorMessage);
    }
  }, [client, isReady]);

  return {
    getCategories,
    isReady,
    isLoading,
  };
};
