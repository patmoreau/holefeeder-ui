import { anAxiosResponse } from '@/__tests__';
import { aTagResponse } from '@/__tests__/mocks/tag-builder';
import { tagApi } from '@/features/purchase/api/tag-api';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

const mockApiService = jest.mocked(apiService);

describe('tag-api', () => {
  const mockToken = 'test-token';
  const mockGetWithAuth = jest.fn();
  const mockData = [aTagResponse(), aTagResponse()];
  let service: ReturnType<typeof tagApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      getWithAuth: mockGetWithAuth,
    } as any);
    service = tagApi(mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return list of accounts', async () => {
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
});
