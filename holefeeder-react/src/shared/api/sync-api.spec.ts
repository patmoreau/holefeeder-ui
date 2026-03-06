import { apiService } from '@/shared/api/api-service';
import { syncApi } from '@/shared/api/sync-api';

jest.mock('@/shared/api/api-service');

const mockApiService = jest.mocked(apiService);

describe('sync-api', () => {
  const mockToken = 'test-token';
  const mockPostWithAuth = jest.fn();
  let service: ReturnType<typeof syncApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      postWithAuth: mockPostWithAuth,
    } as any);
    service = syncApi(mockToken);
  });

  describe('upload', () => {
    it('should upload data with transaction ID', async () => {
      mockPostWithAuth.mockResolvedValue(undefined);
      const transactionId = 123;
      const operations: any[] = [{ op: 'PUT', table: 'test', data: {} }];

      await service.upload({ transactionId, operations });

      expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/sync/powersync', {
        transaction_id: transactionId,
        operations: operations,
      });
    });

    it('should upload data without transaction ID', async () => {
      mockPostWithAuth.mockResolvedValue(undefined);
      const operations: any[] = [{ op: 'PUT', table: 'test', data: {} }];

      await service.upload({ operations });

      expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/sync/powersync', {
        transaction_id: undefined,
        operations: operations,
      });
    });

    it('should handle API errors', async () => {
      const serverError = new Error('HTTP 500: Internal Server Error');
      mockPostWithAuth.mockRejectedValue(serverError);
      const operations: any[] = [];

      await expect(service.upload({ operations })).rejects.toThrow('HTTP 500');
    });
  });
});
