import { anAxiosResponse } from '@/__tests__';
import { aSummary } from '@/__tests__/mocks/summary-for-test';
import { dashboardApi } from '@/features/dashboard/api/dashboard-api';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');

const mockApiService = jest.mocked(apiService);

describe('dashboard-api', () => {
  const mockToken = 'test-token';
  const mockGetWithAuth = jest.fn();
  const mockData = aSummary();
  let service: ReturnType<typeof dashboardApi>;

  beforeEach(() => {
    mockApiService.mockReturnValue({
      getWithAuth: mockGetWithAuth,
    } as any);
    service = dashboardApi(mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('query', () => {
    it('should return dashboard summary', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      const response = await service.query();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockGetWithAuth).toHaveBeenCalledWith('/api/v2/dashboard/summary');
    });

    it('should make request with auth header', async () => {
      mockGetWithAuth.mockResolvedValue(anAxiosResponse(mockData, { status: 200 }));

      await service.query();

      expect(mockGetWithAuth).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const aServerError = anAxiosResponse({ error: 'Server error' }, { status: 500 });
      mockGetWithAuth.mockRejectedValue(aServerError);

      await expect(service.query()).rejects.toEqual(aServerError);
    });
  });
});
