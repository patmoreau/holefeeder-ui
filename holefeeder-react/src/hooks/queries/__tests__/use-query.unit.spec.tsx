import { waitFor } from '@testing-library/react-native';
import { useAuth } from '@/hooks';
import { anEmptyTokenInfo, aTokenInfo } from '@/__tests__';
import {
  createListQueryHook,
  createOneQueryHook,
} from '@/hooks/queries/use-query';
import { renderQueryHook } from './mocks/mock-query-client';

jest.mock('@/hooks/use-auth');

const mockedUseAuth = jest.mocked(useAuth);

describe('Query Hook Creators', () => {
  const mockTokenInfo = aTokenInfo();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      tokenInfo: mockTokenInfo,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        const { useList } = createListQueryHook<TestItem>(
          'test-resource',
          mockGetList
        );

        const { result } = renderQueryHook(() => useList());

        await waitFor(() => expect(result.current.isPending).toBe(true));
        expect(mockGetList).not.toHaveBeenCalledWith(
          '1',
          mockTokenInfo.accessToken
        );
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo,
        } as any);
        const { useList } = createListQueryHook<TestItem>(
          'test-resource',
          mockGetList
        );

        const { result } = renderQueryHook(() => useList());

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetList).toHaveBeenCalledWith(tokenInfo.accessToken, null);
      });
    });

    describe('without authentication', () => {
      const { useList } = createListQueryHook<TestItem>(
        'test-resource',
        mockGetList,
        false
      );

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
      const { useList } = createListQueryHook<TestItem>(
        'test-resource',
        mockGetList
      );

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
      const { useList } = createListQueryHook<TestItem, QueryParams>(
        'test-resource',
        mockGetListWithParams
      );

      const queryParams = { filter: 'test' };
      const { result } = renderQueryHook(() => useList(queryParams));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockGetListWithParams).toHaveBeenCalledWith(
        mockTokenInfo.accessToken,
        queryParams
      );
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
        const { useOne } = createOneQueryHook<TestItem>(
          'test-resource',
          mockGetOne
        );

        const { result } = renderQueryHook(() => useOne('1'));

        await waitFor(() => expect(result.current.isPending).toBe(true));
        expect(mockGetOne).not.toHaveBeenCalledWith(
          '1',
          mockTokenInfo.accessToken
        );
      });

      it('should call api when token is available', async () => {
        const tokenInfo = aTokenInfo();
        mockedUseAuth.mockReturnValue({
          tokenInfo: tokenInfo,
        } as any);
        const { useOne } = createOneQueryHook<TestItem>(
          'test-resource',
          mockGetOne
        );

        const { result } = renderQueryHook(() => useOne('1'));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetOne).toHaveBeenCalledWith('1', tokenInfo.accessToken);
      });
    });

    describe('without authentication', () => {
      const { useOne } = createOneQueryHook<TestItem>(
        'test-resource',
        mockGetOne,
        false
      );

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
      const { useOne } = createOneQueryHook<TestItem>(
        'test-resource',
        mockGetOne
      );

      const { result } = renderQueryHook(() => useOne('1'));

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Verify the data is correct
      expect(result.current.data).toEqual(mockItem);
      expect(mockGetOne).toHaveBeenCalledWith('1', mockTokenInfo.accessToken);
    });

    it('should not fetch when id is missing', () => {
      const { useOne } = createOneQueryHook<TestItem>(
        'test-resource',
        mockGetOne
      );

      const { result } = renderQueryHook(() => useOne(''));

      expect(result.current.isLoading).toBeFalsy();
      expect(mockGetOne).not.toHaveBeenCalled();
    });
  });
});
