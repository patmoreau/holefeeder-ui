import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { aStoreItem } from '@/__tests__/mocks/store-item-for-test';
import { storeItemApi } from '@/features/settings/api/store-item-api';
import { PaginatedQueryParams } from '@/shared/hooks/queries/use-query';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

const mockApiService = jest.mocked(apiService);

describe('store-item-api', () => {
  const mockToken = 'test-token';
  const mockGetWithAuth = jest.fn();
  const mockPostWithAuth = jest.fn();
  const mockData = [aStoreItem(), aStoreItem()];
  let service: ReturnType<typeof storeItemApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      getWithAuth: mockGetWithAuth,
      postWithAuth: mockPostWithAuth,
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

  describe('create', () => {
    it('should create a store item with code and data', async () => {
      const mockResponse = anAxiosResponse({ id: 'test-id' }, { status: 201 });
      mockPostWithAuth.mockResolvedValue(mockResponse);

      const code = 'test-code';
      const data = 'test-data';

      const response = await service.create(code, data);

      expect(response.status).toBe(201);
      expect(response.data).toEqual({ id: 'test-id' });
      expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/store-items/create-store-item', {
        code,
        data,
      });
    });

    it('should make request with auth header', async () => {
      const mockResponse = anAxiosResponse({}, { status: 201 });
      mockPostWithAuth.mockResolvedValue(mockResponse);

      await service.create('code', 'data');

      expect(mockPostWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockPostWithAuth.mockRejectedValue(aServerError);

      await expect(service.create('code', 'data')).rejects.toEqual(aServerError);
    });
  });

  describe('modify', () => {
    it('should modify a store item with id and data', async () => {
      const mockResponse = anAxiosResponse({ success: true }, { status: 200 });
      mockPostWithAuth.mockResolvedValue(mockResponse);

      const id = 'test-id';
      const data = 'updated-data';

      const response = await service.modify(id, data);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ success: true });
      expect(mockPostWithAuth).toHaveBeenCalledWith('/api/v2/store-items/modify-store-item', {
        id,
        data,
      });
    });

    it('should make request with auth header', async () => {
      const mockResponse = anAxiosResponse({}, { status: 200 });
      mockPostWithAuth.mockResolvedValue(mockResponse);

      await service.modify('id', 'data');

      expect(mockPostWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockPostWithAuth.mockRejectedValue(aServerError);

      await expect(service.modify('id', 'data')).rejects.toEqual(aServerError);
    });
  });
});
