import { waitFor } from '@testing-library/react-native';
import { anAccount, aTokenInfo } from '@/__tests__';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { mockQueryClient, renderQueryHook } from '@/__tests__/mocks/mock-query-client';
import { accountApi } from '@/features/purchase/api/account-api';
import { useAccounts } from '@/features/purchase/core/use-accounts';
import { useAuth } from '@/shared/hooks/use-auth';

jest.mock('@/features/purchase/api/account-api');
jest.mock('@/shared/hooks/use-auth');

const mockService = jest.mocked(accountApi);
const mockUseAuth = jest.mocked(useAuth);

describe('accountQueries', () => {
  const tokenInfo = aTokenInfo();
  const mockAccounts = [anAccount()];
  const mockGetAccounts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ tokenInfo } as any);
    mockGetAccounts.mockResolvedValue(anAxiosResponse(mockAccounts));
    mockService.mockReturnValue({
      getAll: mockGetAccounts,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockQueryClient.clear();
  });

  describe('createListQueryHook', () => {
    it('should create a working list query hook', async () => {
      const { result } = renderQueryHook(() => useAccounts());
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual(mockAccounts);
    });
  });
});
