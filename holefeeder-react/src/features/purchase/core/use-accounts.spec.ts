import { waitFor } from '@testing-library/react-native';
import { aTokenInfo } from '@/__tests__';
import { anAccount } from '@/__tests__/mocks/account-builder';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { useAccounts } from '@/features/purchase/core/use-accounts';
import { useAuth } from '@/shared/hooks/use-auth';
import { apiService } from '@/shared/services/api-service';
import { renderQueryHook } from '../../../__tests__/mocks/mock-query-client';

jest.mock('@/shared/services/api-service');
jest.mock('@/shared/hooks/use-auth');

const mockApiService = jest.mocked(apiService);
const mockUseAuth = jest.mocked(useAuth);

describe('accountQueries', () => {
  const tokenInfo = aTokenInfo();
  const mockAccounts = [anAccount()];
  const mockGetAccounts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ tokenInfo } as any);
    mockGetAccounts.mockResolvedValue(anAxiosResponse(mockAccounts));
    mockApiService.mockReturnValue({
      getAccounts: mockGetAccounts,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createListQueryHook', () => {
    it('should create a working list query hook', async () => {
      const { result } = renderQueryHook(() => useAccounts());
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual(mockAccounts);
    });
  });
});
