import { waitFor } from '@testing-library/react-native';
import { anEmptyTokenInfo, aTokenInfo } from '@/__tests__';
import { createMutationHook } from '@/hooks/queries/use-mutation';
import { useAuth } from '@/hooks/use-auth';
import { mockQueryClient, renderQueryHook } from './__tests__/mock-query-client';

jest.mock('@/hooks/use-auth');

const mockedUseAuth = jest.mocked(useAuth);

describe('createMutationHook', () => {
  interface TestItem {
    id: string;
    name: string;
  }

  const mockCommand = jest.fn();
  const mockItem: TestItem = { id: '1', name: 'Test Item' };
  const mockTokenInfo = aTokenInfo();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCommand.mockResolvedValue(mockItem);
  });

  describe('when useCommand is called', () => {
    beforeEach(() => {
      mockedUseAuth.mockReturnValue({
        tokenInfo: null,
      } as any);
    });

    it('should handle command error', async () => {
      mockCommand.mockRejectedValue(new Error('Command failed'));

      const { useCommand } = createMutationHook<TestItem>('test-resource', mockCommand, false);
      const { result } = renderQueryHook(() => useCommand());

      result.current.mutate(mockItem);

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(mockCommand).toHaveBeenCalledWith(mockItem, null);
    });

    describe('with authentication', () => {
      beforeEach(() => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: mockTokenInfo,
        } as any);
      });

      it('should be invoked when token is available', async () => {
        const { useCommand } = createMutationHook<TestItem>('test-resource', mockCommand);
        const { result } = renderQueryHook(() => useCommand());

        result.current.mutate(mockItem);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockCommand).toHaveBeenCalledWith(mockItem, mockTokenInfo.accessToken);
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
          queryKey: ['test-resource', 'list'],
        });
      });

      it('should generate an error when token is not available', async () => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: anEmptyTokenInfo(),
        } as any);

        const { useCommand } = createMutationHook<TestItem>('test-resource', mockCommand);
        const { result } = renderQueryHook(() => useCommand());

        result.current.mutate(mockItem);

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(mockCommand).not.toHaveBeenCalled();
      });
    });

    describe('without authentication', () => {
      beforeEach(() => {
        mockedUseAuth.mockReturnValue({
          tokenInfo: null,
        } as any);
      });

      it('should be invoked when token is not available', async () => {
        const { useCommand } = createMutationHook<TestItem>('test-resource', mockCommand, false);
        const { result } = renderQueryHook(() => useCommand());

        result.current.mutate(mockItem);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockCommand).toHaveBeenCalledWith(mockItem, null);
      });
    });
  });
});
