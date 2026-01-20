export type UseQueryResult<T> = {
  data: T;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
