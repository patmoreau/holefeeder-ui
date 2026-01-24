import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { PropsWithChildren } from 'react';
import { config } from '@/config/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.api.cacheRequests ? 5 * 60 * 1000 : 0, // 5 minutes or 0
      gcTime: config.api.cacheRequests ? 10 * 60 * 1000 : 0, // 10 minutes or 0 (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface QueryProviderProps extends PropsWithChildren {}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      {children}
    </PersistQueryClientProvider>
  );
}

export { queryClient };
