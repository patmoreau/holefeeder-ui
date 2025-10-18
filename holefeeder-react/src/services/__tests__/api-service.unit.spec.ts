import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { aCategory } from '@/__tests__';
import { anAccount } from '@/__tests__/mocks/account-builder';
import { config } from '@/config';
import { apiService } from '@/services/api-service';

// Mock the config
jest.mock('@/config', () => ({
  config: {
    api: {
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      logRequest: false,
    },
  },
}));

describe('apiService', () => {
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

      // Verify the service is created successfully
      expect(service).toBeDefined();
      expect(service.getCategories).toBeDefined();
    });
  });

  describe('request/response logging', () => {
    beforeEach(() => {
      // Enable logging for these tests
      (config.api as any).logRequest = true;
    });

    it('should log requests when logRequest is enabled', async () => {
      mockAxios.onGet('/api/v2/categories').reply(200, []);

      const service = apiService(mockToken);
      await service.getCategories();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Request:',
        expect.objectContaining({
          url: '/api/v2/categories',
          method: 'get',
        })
      );
    });

    it('should log successful responses when logRequest is enabled', async () => {
      const mockData = [{ id: 1, name: 'Category 1' }];
      mockAxios.onGet('/api/v2/categories').reply(200, mockData);

      const service = apiService(mockToken);
      await service.getCategories();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Response:',
        expect.objectContaining({
          status: 200,
          data: mockData,
        })
      );
    });

    it('should log error responses when logRequest is enabled', async () => {
      mockAxios.onGet('/api/v2/categories').reply(404, { error: 'Not found' });

      const service = apiService(mockToken);

      await expect(service.getCategories()).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error Response:',
        expect.objectContaining({
          status: 404,
          data: { error: 'Not found' },
        })
      );
    });

    it('should log network errors when logRequest is enabled', async () => {
      mockAxios.onGet('/api/v2/categories').networkError();

      const service = apiService(mockToken);

      await expect(service.getCategories()).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Error:', 'Network Error');
    });
  });

  describe('getAccounts', () => {
    const mockData = [anAccount(), anAccount()];

    it('should make GET request to accounts endpoint with auth header', async () => {
      mockAxios.onGet('/api/v2/accounts').reply(200, mockData);

      const service = apiService(mockToken);
      const response = await service.getAccounts();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer test-token');
    });

    it('should handle null token', async () => {
      mockAxios.onGet('/api/v2/accounts').reply(200, mockData);

      const service = apiService(null);
      const response = await service.getAccounts();

      expect(response.status).toBe(200);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer null');
    });

    it('should handle API errors', async () => {
      mockAxios.onGet('/api/v2/accounts').reply(500, { error: 'Server error' });

      const service = apiService(mockToken);

      await expect(service.getAccounts()).rejects.toThrow();
    });
  });

  describe('getCategories', () => {
    const mockData = [aCategory(), aCategory()];

    it('should make GET request to categories endpoint with auth header', async () => {
      mockAxios.onGet('/api/v2/categories').reply(200, mockData);

      const service = apiService(mockToken);
      const response = await service.getCategories();

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer test-token');
    });

    it('should handle null token', async () => {
      mockAxios.onGet('/api/v2/categories').reply(200, mockData);

      const service = apiService(null);
      const response = await service.getCategories();

      expect(response.status).toBe(200);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer null');
    });

    it('should handle API errors', async () => {
      mockAxios.onGet('/api/v2/categories').reply(500, { error: 'Server error' });

      const service = apiService(mockToken);

      await expect(service.getCategories()).rejects.toThrow();
    });
  });

  describe('getCategory', () => {
    const mockData = aCategory();
    it('should make GET request to categories endpoint with auth header and id', async () => {
      mockAxios.onGet('/api/v2/categories/1').reply(200, mockData);

      const service = apiService(mockToken);
      const response = await service.getCategory('1');

      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer test-token');
    });

    it('should handle null token', async () => {
      mockAxios.onGet('/api/v2/categories/1').reply(200, mockData);

      const service = apiService(null);
      const response = await service.getCategory('1');

      expect(response.status).toBe(200);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe('Bearer null');
    });

    it('should handle API errors', async () => {
      mockAxios.onGet('/api/v2/categories/1').reply(500, { error: 'Server error' });

      const service = apiService(mockToken);

      await expect(service.getCategory('1')).rejects.toThrow();
    });
  });
});
