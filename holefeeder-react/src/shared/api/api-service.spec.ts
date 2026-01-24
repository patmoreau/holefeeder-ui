import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { config } from '@/config/config';
import { apiService } from '@/shared/api/api-service';

// Mock the config
jest.mock('@/config/config', () => ({
  config: {
    api: {
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      logRequest: false,
    },
  },
}));

interface MockObject {
  id: string;
  name: string;
}

describe('apiService', () => {
  const testApiUrl = '/api/v1/test';
  const mockToken = 'test-token';
  let mockAxios: MockAdapter;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    mockAxios.restore();
    consoleSpy.mockRestore();
  });

  describe('axios instance configuration', () => {
    it('should create axios instance with correct base configuration', () => {
      const service = apiService(mockToken);
      expect(service).toBeDefined();
      expect(service.getWithAuth<MockObject>).toBeDefined();
    });
  });

  describe('request/response logging', () => {
    beforeEach(() => {
      (config.api as any).logRequest = true;
    });

    it('should log requests when logRequest is enabled', async () => {
      mockAxios.onGet(testApiUrl).reply(200, []);

      const service = apiService(mockToken);
      await service.getWithAuth<MockObject[]>(testApiUrl);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Request:',
        expect.objectContaining({
          url: testApiUrl,
          method: 'get',
        })
      );
    });

    it('should log successful responses when logRequest is enabled', async () => {
      const mockData = [{ id: 1, name: 'Category 1' }];
      mockAxios.onGet(testApiUrl).reply(200, mockData);

      const service = apiService(mockToken);
      await service.getWithAuth<MockObject[]>(testApiUrl);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Response:',
        expect.objectContaining({
          status: 200,
          data: mockData,
        })
      );
    });

    it('should log error responses when logRequest is enabled', async () => {
      mockAxios.onGet(testApiUrl).reply(404, { error: 'Not found' });

      const service = apiService(mockToken);

      await expect(service.getWithAuth<MockObject>(testApiUrl)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error Response:',
        expect.objectContaining({
          status: 404,
          data: { error: 'Not found' },
        })
      );
    });

    it('should log network errors when logRequest is enabled', async () => {
      mockAxios.onGet(testApiUrl).networkError();

      const service = apiService(mockToken);

      await expect(service.getWithAuth<MockObject>(testApiUrl)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Error:', 'Network Error');
    });
  });

  describe('getWithAuth', () => {
    const mockData: MockObject[] = [
      {
        id: '1',
        name: 'Category 1',
      },
    ];

    it('should make GET request to test endpoint with auth header', async () => {
      mockAxios.onGet(testApiUrl).reply(200, mockData);

      const service = apiService(mockToken);
      const response = await service.getWithAuth<MockObject>(testApiUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer test-token');
    });

    it('should handle null token', async () => {
      mockAxios.onGet(testApiUrl).reply(200, mockData);

      const service = apiService(null);
      const response = await service.getWithAuth<MockObject>(testApiUrl);

      expect(response.status).toBe(200);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer null');
    });

    it('should handle API errors', async () => {
      mockAxios.onGet(testApiUrl).reply(500, { error: 'Server error' });

      const service = apiService(mockToken);

      await expect(service.getWithAuth<MockObject>(testApiUrl)).rejects.toThrow();
    });

    it('should handle unauthorized errors', async () => {
      mockAxios.onGet(testApiUrl).reply(401, { message: 'Unauthorized' });

      const service = apiService(mockToken);

      await expect(service.getWithAuth<MockObject>(testApiUrl)).rejects.toThrow();
    });
  });

  describe('postWithAuth', () => {
    const mockData: MockObject[] = [
      {
        id: '1',
        name: 'Category 1',
      },
    ];

    it('should make POST request to test endpoint with auth header', async () => {
      mockAxios.onPost(testApiUrl).reply(201);

      const service = apiService(mockToken);
      const response = await service.postWithAuth<MockObject>(testApiUrl, mockData[0]);

      expect(response.status).toBe(201);
      expect(mockAxios.history.post[0].headers?.Authorization).toBe('Bearer test-token');
    });

    it('should handle null token', async () => {
      mockAxios.onPost(testApiUrl).reply(201);

      const service = apiService(null);
      const response = await service.postWithAuth<MockObject>(testApiUrl, mockData[0]);

      expect(response.status).toBe(201);
      expect(mockAxios.history.post[0].headers?.Authorization).toBe('Bearer null');
    });

    it('should handle API errors', async () => {
      mockAxios.onPost(testApiUrl).reply(500, { error: 'Server error' });

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, mockData[0])).rejects.toThrow();
    });

    it('should handle unauthorized errors', async () => {
      mockAxios.onPost(testApiUrl).reply(401, { message: 'Unauthorized' });

      const service = apiService(mockToken);

      await expect(service.postWithAuth<MockObject>(testApiUrl, mockData[0])).rejects.toThrow();
    });
  });
});
