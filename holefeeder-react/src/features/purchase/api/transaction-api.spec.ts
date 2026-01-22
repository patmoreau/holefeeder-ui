import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { aPurchase, aTransfer } from '@/__tests__/mocks/purchase-builder';
import { transactionApi } from '@/features/purchase/api/transaction-api';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

const mockApiService = jest.mocked(apiService);

describe('transaction-api', () => {
  const mockToken = 'test-token';
  const mockPostWithAuth = jest.fn();
  const purchase = aPurchase();
  const transfer = aTransfer();
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

      const response = await service.createTransaction(purchase);

      expect(response.status).toBe(201);
      expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/transactions/make-purchase', {
        date: purchase.date,
        amount: purchase.amount,
        description: purchase.description,
        accountId: purchase.sourceAccount!.id,
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

    describe('makeTransfer', () => {
      it('should make transfer', async () => {
        mockPostWithAuth.mockResolvedValue(anAxiosResponse(transfer, { status: 201 }));

        const response = await service.createTransaction(transfer);

        expect(response.status).toBe(201);
        expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/transactions/transfer', {
          date: transfer.date,
          amount: transfer.amount,
          description: transfer.description,
          fromAccountId: transfer.sourceAccount!.id,
          toAccountId: transfer.targetAccount!.id,
        });
      });
    });

    it('should make request with auth header', async () => {
      mockPostWithAuth.mockResolvedValue(anAxiosResponse(purchase, { status: 201 }));

      await service.createTransaction(purchase);

      expect(mockPostWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockPostWithAuth.mockRejectedValue(aServerError);

      await expect(service.createTransaction(purchase)).rejects.toEqual(aServerError);
    });
  });
});
