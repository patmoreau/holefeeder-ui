import { waitFor } from '@testing-library/react-native';
import { aTokenInfo } from '@/__tests__/mocks/token-info-builder';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { mockQueryClient, renderQueryHook } from '@/__tests__/mocks/mock-query-client';
import { aPurchase } from '@/__tests__/mocks/purchase-builder';
import { transactionApi } from '@/features/purchase/api/transaction-api';
import { usePurchase } from '@/features/purchase/core/use-transactions';
import { useAuth } from '@/shared/hooks/use-auth';

jest.mock('@/features/purchase/api/transaction-api');
jest.mock('@/shared/hooks/use-auth');

const mockService = jest.mocked(transactionApi);
const mockUseAuth = jest.mocked(useAuth);

describe('purchaseMutation', () => {
  const tokenInfo = aTokenInfo();
  const purchase = aPurchase();
  const mockCreateTransaction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ tokenInfo } as any);
    mockCreateTransaction.mockResolvedValue(anAxiosResponse({}));
    mockService.mockReturnValue({
      createTransaction: mockCreateTransaction,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockQueryClient.clear();
  });

  describe('createMutationHook', () => {
    it('should create a working list query hook', async () => {
      const { result } = renderQueryHook(() => usePurchase());

      result.current.mutate(purchase);

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockCreateTransaction).toHaveBeenCalledWith(purchase);
    });
  });
});
