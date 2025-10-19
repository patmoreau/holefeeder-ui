import { waitFor } from '@testing-library/react-native';
import { aCategory, aTokenInfo } from '@/__tests__';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { renderQueryHook } from '@/__tests__/mocks/mock-query-client';
import { useCategories, useCategory } from '@/features/purchase/core/use-categories';
import { useAuth } from '@/shared/hooks/use-auth';
import { apiService } from '@/shared/services/api-service';

jest.mock('@/shared/services/api-service');
jest.mock('@/shared/hooks/use-auth');

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
