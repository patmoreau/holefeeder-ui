import { anAxiosResponse } from '@/__tests__';
import { aStoreItem } from '@/__tests__/mocks/store-item-for-test';
import { storeItemApi } from '@/features/settings/api/store-item-api';
import { PaginatedQueryParams } from '@/shared/hooks/queries/use-query';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

const mockApiService = jest.mocked(apiService);

describe('store-item-api', () => {
  const mockToken = 'test-token';
  const mockGetWithAuth = jest.fn();
  const mockData = [aStoreItem(), aStoreItem()];
  let service: ReturnType<typeof storeItemApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      getWithAuth: mockGetWithAuth,
    } as any);
    service = storeItemApi(mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('query', () => {
    it('should return list of store items without params', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      const response = await service.query(null);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockGetWithAuth).toHaveBeenCalledWith('/api/v2/store-items', { params: {} });
    });

    it('should return list of store items with filter', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      const queryParams: PaginatedQueryParams<{ code: string }> = {
        filter: { code: 'test-code' },
      };

      const response = await service.query(queryParams);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockGetWithAuth).toHaveBeenCalledWith('/api/v2/store-items', {
        params: { filter: 'code:eq:test-code' },
      });
    });

    it('should make request with auth header', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      await service.query(null);

      expect(mockGetWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockGetWithAuth.mockRejectedValue(aServerError);

      await expect(service.query(null)).rejects.toEqual(aServerError);
    });

    it('should handle query params without filter', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      const queryParams: PaginatedQueryParams<{ code: string }> = {
        offset: 0,
        limit: 10,
      };

      const response = await service.query(queryParams);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockGetWithAuth).toHaveBeenCalledWith('/api/v2/store-items', { params: {} });
    });
  });
});
