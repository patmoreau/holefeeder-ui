import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/use-auth';

type ListQueryKeys<P> = {
  all: readonly [string];
  list: (queryParams: P | null) => readonly [string, 'list', P | null];
};

type DetailQueryKeys = {
  all: readonly [string];
  detail: (id: string) => readonly [string, 'detail', string];
};

type PaginatedQueryKeys<P> = {
  all: readonly [string];
  paginated: (queryParams: P | null) => readonly [string, 'paginated', P | null];
};

export type PaginatedQueryParams<F = Record<string, any>> = {
  offset?: number;
  limit?: number;
  sort?: string[];
  filter?: F;
};

export const createListQueryHook = <T extends { id: string | number }, P = void>(
  resourceName: string,
  getList: (authToken: string | null, queryParams: P | null) => Promise<T[]>,
  withAuth: boolean = true
) => {
  const keys: ListQueryKeys<P> = {
    all: [resourceName] as const,
    list: (queryParams: P | null) => [...keys.all, 'list', queryParams] as const,
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

export const createPaginatedQueryHook = <
  T extends { id: string | number },
  F = Record<string, any>,
  P extends PaginatedQueryParams<F> = PaginatedQueryParams<F>,
>(
  resourceName: string,
  getList: (queryParams: P | null, authToken: string | null) => Promise<T[]>,
  withAuth: boolean = true
) => {
  const keys: PaginatedQueryKeys<P> = {
    all: [resourceName] as const,
    paginated: (queryParams: P | null) => [...keys.all, 'paginated', queryParams] as const,
  };

  const usePaginated = (queryParams: P | null = null) => {
    const { tokenInfo } = useAuth();
    const token = withAuth ? tokenInfo.accessToken : null;

    return useQuery({
      queryKey: keys.paginated(queryParams),
      queryFn: () => getList(queryParams, token),
      enabled: withAuth ? !!token : true,
    });
  };

  return { usePaginated, keys };
};

export const createOneQueryHook = <T extends { id: string | number }>(
  resourceName: string,
  getOne: (id: string | number, authToken: string | null) => Promise<T>,
  withAuth: boolean = true
) => {
  const keys: DetailQueryKeys = {
    all: [resourceName] as const,
    detail: (id: string) => [...keys.all, 'detail', id] as const,
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

export const useMultipleQueries = (...queries: ReturnType<typeof useQuery>[]) => {
  return {
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    isError: queries.some((q) => q.isError),
    isSuccess: queries.every((q) => q.isSuccess),
    errors: queries.filter((q) => q.error).map((q) => q.error),
  };
};
