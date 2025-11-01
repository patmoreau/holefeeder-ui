import { aCategory, anAxiosResponse } from '@/__tests__';
import { categoryApi } from '@/features/purchase/api/category-api';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

// Mock the config
const mockApiService = jest.mocked(apiService);

describe('category-api', () => {
  const mockToken = 'test-token';
  const mockGetWithAuth = jest.fn();
  let service: ReturnType<typeof categoryApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      getWithAuth: mockGetWithAuth,
    } as any);
    service = categoryApi(mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const mockData = [aCategory(), aCategory()];

    it('should return list of categories', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      const response = await service.getAll();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
    });

    it('should make request with auth header', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      await service.getAll();

      expect(mockGetWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockGetWithAuth.mockRejectedValue(aServerError);

      await expect(service.getAll()).rejects.toEqual(aServerError);
    });
  });

  describe('getById', () => {
    const mockData = aCategory();

    it('should return category', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      const response = await service.getById('1');

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
    });

    it('should make request with auth header', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      await service.getAll();

      expect(mockGetWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockGetWithAuth.mockRejectedValue(aServerError);

      await expect(service.getAll()).rejects.toEqual(aServerError);
    });
  });
});
