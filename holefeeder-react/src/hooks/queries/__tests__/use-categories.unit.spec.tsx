import { renderHook, waitFor } from '@testing-library/react-native';
import { apiService } from '@/services';
import { useAuth, useCategories, useCategory } from '@/hooks';
import { aCategory, aTokenInfo } from '@/__tests__';
import {
  createListQueryHook,
  createOneQueryHook,
} from '@/hooks/queries/use-query';
import {
  renderQueryHook,
} from './mocks/mock-query-client';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response';

jest.mock('@/services/api-service');
jest.mock('@/hooks/use-auth');

const mockApiService = jest.mocked(apiService);
const mockUseAuth = jest.mocked(useAuth);

describe('categoryQueries', () => {
  const tokenInfo = aTokenInfo();
  const mockCategories = [aCategory()];
  const mockCategory = aCategory();
  const mockGetCategories = jest.fn();
  const mockGetCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ tokenInfo } as any);
    mockGetCategories.mockResolvedValue(anAxiosResponse(mockCategories));
    mockGetCategory.mockResolvedValue(anAxiosResponse(mockCategory));
    mockApiService.mockReturnValue({
      getCategories: mockGetCategories,
      getCategory: mockGetCategory,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createListQueryHook', () => {
    it('should create a working list query hook', async () => {
      const { result } = renderQueryHook(() => useCategories());
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual(mockCategories);
    });
  });

  describe('createOneQueryHook', () => {
    it('should create a working detail query hook', async () => {
      const { result } = renderQueryHook(() => useCategory('1'));
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual(mockCategory);
    });
  });
});
