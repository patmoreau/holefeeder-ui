import { anAxiosResponse } from '@/__tests__';
import { aPurchase } from '@/__tests__/mocks/purchase-builder';
import { transactionApi } from '@/features/purchase/api/transaction-api';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

const mockApiService = jest.mocked(apiService);

describe('transaction-api', () => {
  const mockToken = 'test-token';
  const mockPostWithAuth = jest.fn();
  const purchase = aPurchase();
  let service: ReturnType<typeof transactionApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      postWithAuth: mockPostWithAuth,
    } as any);
    service = transactionApi(mockToken);
  });

  describe('makePurchase', () => {
    it('should make purchase', async () => {
      mockPostWithAuth.mockResolvedValue(anAxiosResponse(purchase, { status: 201 }));

      const response = await service.makePurchase(purchase);

      expect(response.status).toBe(201);
      expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/transactions/make-purchase', {
        date: purchase.date,
        amount: purchase.amount,
        description: purchase.description,
        accountId: purchase.account!.id,
        categoryId: purchase.category!.id,
        tags: purchase.tags.map((tag) => tag.id),
        cashflow: purchase.hasCashflow
          ? {
              effectiveDate: purchase.cashflowEffectiveDate,
              intervalType: purchase.cashflowIntervalType,
              frequency: purchase.cashflowFrequency,
              recurrence: 0,
            }
          : undefined,
      });
    });

    it('should make request with auth header', async () => {
      mockPostWithAuth.mockResolvedValue(anAxiosResponse(purchase, { status: 201 }));

      await service.makePurchase(purchase);

      expect(mockPostWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockPostWithAuth.mockRejectedValue(aServerError);

      await expect(service.makePurchase(purchase)).rejects.toEqual(aServerError);
    });
  });
});
