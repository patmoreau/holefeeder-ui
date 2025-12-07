import { waitFor } from '@testing-library/react-native';
import { anEmptyTokenInfo, aTokenInfo } from '@/__tests__';
import { mockQueryClient, renderQueryHook } from '@/__tests__/mocks/mock-query-client';
import { createListQueryHook, createOneQueryHook, createPaginatedQueryHook, PaginatedQueryParams } from '@/shared/hooks/queries/use-query';
import { useAuth } from '@/shared/hooks/use-auth';

jest.mock('@/shared/hooks/use-auth');

const mockedUseAuth = jest.mocked(useAuth);

describe('Query Hook Creators', () => {
  const mockTokenInfo = aTokenInfo();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      tokenInfo: mockTokenInfo,
    } as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    mockQueryClient.clear();
    await Promise.resolve();
  });

  describe('createListQueryHook', () => {
    interface TestItem {
      id: string;
      name: string;
    }

    const mockItems: TestItem[] = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];

    const mockGetList = jest.fn().mockResolvedValue(mockItems);

    describe('with authentication', () => {
      it('should not call api when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);
        const { useList } = createListQueryHook<TestItem>('test-resource', mockGetList);

        const { result } = renderQueryHook(() => useList());

        await waitFor(() => expect(result.current.isPending).toBe(true));
        expect(mockGetList).not.toHaveBeenCalledWith('1', mockTokenInfo.accessToken);
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo,
        } as any);
        const { useList } = createListQueryHook<TestItem>('test-resource', mockGetList);

        const { result } = renderQueryHook(() => useList());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetList).toHaveBeenCalledWith(tokenInfo.accessToken, null);
      });
    });

    describe('without authentication', () => {
      const { useList } = createListQueryHook<TestItem>('test-resource', mockGetList, false);

      it('should call api when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);

        const { result } = renderQueryHook(() => useList());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetList).toHaveBeenCalledWith(null, null);
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo: tokenInfo,
        } as any);

        const { result } = renderQueryHook(() => useList());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetList).toHaveBeenCalledWith(null, null);
      });
    });

    it('should create a working list query hook', async () => {
      const { useList } = createListQueryHook<TestItem>('test-resource', mockGetList);

      const { result } = renderQueryHook(() => useList());

      // Should start with loading state
      // expect(result.current.isLoading).toBeTruthy();

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Verify the data is correct
      expect(result.current.data).toEqual(mockItems);
      expect(mockGetList).toHaveBeenCalledWith(mockTokenInfo.accessToken, null);
    });

    it('should handle query parameters', async () => {
      interface QueryParams {
        filter: string;
      }

      const mockGetListWithParams = jest.fn().mockResolvedValue(mockItems);
      const { useList } = createListQueryHook<TestItem, QueryParams>('test-resource', mockGetListWithParams);

      const queryParams = { filter: 'test' };
      const { result } = renderQueryHook(() => useList(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetListWithParams).toHaveBeenCalledWith(mockTokenInfo.accessToken, queryParams);
    });
  });

  describe('createPaginatedQueryHook', () => {
    interface TestItem {
      id: string;
      name: string;
    }

    const mockItems: TestItem[] = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];

    const mockGetPaginated = jest.fn().mockResolvedValue(mockItems);

    describe('with authentication', () => {
      it('should not call api when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);
        const { usePaginated } = createPaginatedQueryHook<TestItem>('test-resource', mockGetPaginated);

        const { result } = renderQueryHook(() => usePaginated());

        await waitFor(() => expect(result.current.isPending).toBe(true));
        expect(mockGetPaginated).not.toHaveBeenCalledWith(null, mockTokenInfo.accessToken);
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo,
        } as any);
        const { usePaginated } = createPaginatedQueryHook<TestItem>('test-resource', mockGetPaginated);

        const { result } = renderQueryHook(() => usePaginated());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetPaginated).toHaveBeenCalledWith(null, tokenInfo.accessToken);
      });
    });

    describe('without authentication', () => {
      const { usePaginated } = createPaginatedQueryHook<TestItem>('test-resource', mockGetPaginated, false);

      it('should call api when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);

        const { result } = renderQueryHook(() => usePaginated());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetPaginated).toHaveBeenCalledWith(null, null);
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo: tokenInfo,
        } as any);

        const { result } = renderQueryHook(() => usePaginated());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetPaginated).toHaveBeenCalledWith(null, null);
      });
    });

    it('should create a working paginated query hook', async () => {
      const { usePaginated } = createPaginatedQueryHook<TestItem>('test-resource', mockGetPaginated);

      const { result } = renderQueryHook(() => usePaginated());

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Verify the data is correct
      expect(result.current.data).toEqual(mockItems);
      expect(mockGetPaginated).toHaveBeenCalledWith(null, mockTokenInfo.accessToken);
    });

    it('should handle pagination parameters', async () => {
      const mockGetPaginatedWithParams = jest.fn().mockResolvedValue(mockItems);
      const { usePaginated } = createPaginatedQueryHook<TestItem>('test-resource', mockGetPaginatedWithParams);

      const queryParams: PaginatedQueryParams = { offset: 10, limit: 20 };
      const { result } = renderQueryHook(() => usePaginated(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetPaginatedWithParams).toHaveBeenCalledWith(queryParams, mockTokenInfo.accessToken);
    });

    it('should handle sort parameters', async () => {
      const mockGetPaginatedWithParams = jest.fn().mockResolvedValue(mockItems);
      const { usePaginated } = createPaginatedQueryHook<TestItem>('test-resource', mockGetPaginatedWithParams);

      const queryParams: PaginatedQueryParams = { sort: ['name', 'asc'] };
      const { result } = renderQueryHook(() => usePaginated(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetPaginatedWithParams).toHaveBeenCalledWith(queryParams, mockTokenInfo.accessToken);
    });

    it('should handle filter parameters', async () => {
      interface FilterParams {
        category?: string;
        status?: string;
      }

      const mockGetPaginatedWithParams = jest.fn().mockResolvedValue(mockItems);
      const { usePaginated } = createPaginatedQueryHook<TestItem, FilterParams>('test-resource', mockGetPaginatedWithParams);

      const queryParams: PaginatedQueryParams<FilterParams> = { filter: { category: 'electronics', status: 'active' } };
      const { result } = renderQueryHook(() => usePaginated(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetPaginatedWithParams).toHaveBeenCalledWith(queryParams, mockTokenInfo.accessToken);
    });

    it('should handle all parameters together', async () => {
      interface FilterParams {
        status?: string;
      }

      const mockGetPaginatedWithParams = jest.fn().mockResolvedValue(mockItems);
      const { usePaginated } = createPaginatedQueryHook<TestItem, FilterParams>('test-resource', mockGetPaginatedWithParams);

      const queryParams: PaginatedQueryParams<FilterParams> = {
        offset: 0,
        limit: 10,
        sort: ['name', 'desc'],
        filter: { status: 'active' },
      };
      const { result } = renderQueryHook(() => usePaginated(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetPaginatedWithParams).toHaveBeenCalledWith(queryParams, mockTokenInfo.accessToken);
    });

    it('should handle custom filter type (e.g., StoreItemQueryParams)', async () => {
      interface StoreItemFilter {
        code?: string;
        category?: string;
      }

      type StoreItemQueryParams = PaginatedQueryParams<StoreItemFilter>;

      const mockGetPaginatedWithExtendedParams = jest.fn().mockResolvedValue(mockItems);
      const { usePaginated } = createPaginatedQueryHook<TestItem, StoreItemFilter>('test-resource', mockGetPaginatedWithExtendedParams);

      const queryParams: StoreItemQueryParams = {
        offset: 0,
        limit: 10,
        filter: {
          code: 'ABC123',
          category: 'books',
        },
      };
      const { result } = renderQueryHook(() => usePaginated(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetPaginatedWithExtendedParams).toHaveBeenCalledWith(queryParams, mockTokenInfo.accessToken);
    });
  });

  describe('createOneQueryHook', () => {
    interface TestItem {
      id: string;
      name: string;
    }

    const mockItem: TestItem = { id: '1', name: 'Test Item' };
    const mockGetOne = jest.fn().mockResolvedValue(mockItem);

    describe('with authentication', () => {
      it('should not call api when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);
        const { useOne } = createOneQueryHook<TestItem>('test-resource', mockGetOne);

        const { result } = renderQueryHook(() => useOne('1'));

        await waitFor(() => expect(result.current.isPending).toBe(true));
        expect(mockGetOne).not.toHaveBeenCalledWith('1', mockTokenInfo.accessToken);
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo: tokenInfo,
        } as any);
        const { useOne } = createOneQueryHook<TestItem>('test-resource', mockGetOne);

        const { result } = renderQueryHook(() => useOne('1'));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetOne).toHaveBeenCalledWith('1', tokenInfo.accessToken);
      });
    });

    describe('without authentication', () => {
      const { useOne } = createOneQueryHook<TestItem>('test-resource', mockGetOne, false);

      it('should call api when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);

        const { result } = renderQueryHook(() => useOne('1'));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetOne).toHaveBeenCalledWith('1', null);
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo: tokenInfo,
        } as any);

        const { result } = renderQueryHook(() => useOne('1'));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetOne).toHaveBeenCalledWith('1', null);
      });
    });

    it('should create a working detail query hook', async () => {
      const { useOne } = createOneQueryHook<TestItem>('test-resource', mockGetOne);

      const { result } = renderQueryHook(() => useOne('1'));

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Verify the data is correct
      expect(result.current.data).toEqual(mockItem);
      expect(mockGetOne).toHaveBeenCalledWith('1', mockTokenInfo.accessToken);
    });

    it('should not fetch when id is missing', () => {
      const { useOne } = createOneQueryHook<TestItem>('test-resource', mockGetOne);

      const { result } = renderQueryHook(() => useOne(''));

      expect(result.current.isLoading).toBeFalsy();
      expect(mockGetOne).not.toHaveBeenCalled();
    });
  });
});
