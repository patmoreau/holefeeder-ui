import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';

type ListQueryKeys<P> = {
  all: readonly [string];
  list: (queryParams: P | null) => readonly [string, 'list', P | null];
};

type DetailQueryKeys = {
  all: readonly [string];
  detail: (id: string) => readonly [string, 'detail', string];
};

export const createListQueryHook = <
  T extends { id: string | number },
  P = void,
>(
  resourceName: string,
  getList: (authToken: string | null, queryParams: P | null) => Promise<T[]>,
  withAuth: boolean = true
) => {
  const keys: ListQueryKeys<P> = {
    all: [resourceName] as const,
    list: (queryParams: P | null) =>
      [...keys.all, 'list', queryParams] as const,
  };

  const useList = (queryParams: P | null = null) => {
    const { tokenInfo } = useAuth();
    const token = withAuth ? tokenInfo.accessToken : null;

    return useQuery({
      queryKey: keys.list(queryParams),
      queryFn: () => getList(token, queryParams),
      enabled: withAuth ? !!token : true,
    });
  };

  return { useList, keys };
};

export const createOneQueryHook = <T extends { id: string | number }>(
  resourceName: string,
  getOne: (id: string | number, authToken: string | null) => Promise<T>,
  withAuth: boolean = true
) => {
  const keys: DetailQueryKeys = {
    all: [resourceName] as const,
    detail: (id: string) =>
      [...keys.all, 'detail', id] as const,
  };

  const useOne = (id: string) => {
    const { tokenInfo } = useAuth();
    const token = withAuth ? tokenInfo.accessToken : null;

    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () => getOne(id, token),
      enabled: withAuth ? !!token && !!id : true,
    });
  };

  return { useOne, keys };
};
