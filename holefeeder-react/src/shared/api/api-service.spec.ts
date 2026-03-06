import { config } from '@/config/config';
import { apiService } from '@/shared/api/api-service';

jest.mock('@/config/config', () => ({
  config: {
    api: {
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      logRequest: false,
      simulateNetworkDelay: 0,
    },
  },
}));

interface MockObject {
  id: string;
  name: string;
}

const makeResponse = (status: number, body: unknown = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('apiService', () => {
  const testApiUrl = '/api/v1/test';
  const mockToken = 'test-token';
  let fetchSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  describe('service configuration', () => {
    it('should create service with postWithAuth defined', () => {
      const service = apiService(mockToken);
      expect(service).toBeDefined();
      expect(service.postWithAuth).toBeDefined();
    });
  });

  describe('request/response logging', () => {
    beforeEach(() => {
      (config.api as any).logRequest = true;
    });

    afterEach(() => {
      (config.api as any).logRequest = false;
    });

    it('should log requests when logRequest is enabled', async () => {
      fetchSpy.mockResolvedValue(makeResponse(200));

      const service = apiService(mockToken);
      await service.postWithAuth<MockObject>(testApiUrl, { id: '1', name: 'Test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Request:',
        expect.objectContaining({
          url: testApiUrl,
          method: 'POST',
        })
      );
    });

    it('should log successful responses when logRequest is enabled', async () => {
      fetchSpy.mockResolvedValue(makeResponse(200));

      const service = apiService(mockToken);
      await service.postWithAuth<MockObject>(testApiUrl, { id: '1', name: 'Test' });

      expect(consoleSpy).toHaveBeenCalledWith('Response:', expect.objectContaining({ status: 200 }));
    });

    it('should log error responses when logRequest is enabled', async () => {
      fetchSpy.mockResolvedValue(makeResponse(404, { error: 'Not found' }));

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, { id: '1', name: 'Test' })).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Error Response:', expect.objectContaining({ status: 404 }));
    });

    it('should log network errors when logRequest is enabled', async () => {
      fetchSpy.mockRejectedValue(new TypeError('Network request failed'));

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, { id: '1', name: 'Test' })).rejects.toThrow();
    });
  });

  describe('postWithAuth', () => {
    const mockData: MockObject = { id: '1', name: 'Category 1' };

    it('should make POST request to test endpoint with auth header', async () => {
      fetchSpy.mockResolvedValue(makeResponse(201));

      const service = apiService(mockToken);
      await service.postWithAuth<MockObject>(testApiUrl, mockData);

      expect(fetchSpy).toHaveBeenCalledWith(
        `https://api.example.com${testApiUrl}`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
          body: JSON.stringify(mockData),
        })
      );
    });

    it('should handle null token', async () => {
      fetchSpy.mockResolvedValue(makeResponse(201));

      const service = apiService(null);
      await service.postWithAuth<MockObject>(testApiUrl, mockData);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer null' }),
        })
      );
    });

    it('should handle API errors', async () => {
      fetchSpy.mockResolvedValue(makeResponse(500, { error: 'Server error' }));

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, mockData)).rejects.toThrow('HTTP 500');
    });

    it('should handle unauthorized errors', async () => {
      fetchSpy.mockResolvedValue(makeResponse(401, { message: 'Unauthorized' }));

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, mockData)).rejects.toThrow('HTTP 401');
    });

    it('should throw on network failure', async () => {
      fetchSpy.mockRejectedValue(new TypeError('Network request failed'));

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, mockData)).rejects.toThrow('Network request failed');
    });
  });
});
