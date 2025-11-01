import { waitFor } from '@testing-library/react-native';
import { aTokenInfo } from '@/__tests__';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { mockQueryClient, renderQueryHook } from '@/__tests__/mocks/mock-query-client';
import { aTagResponse } from '@/__tests__/mocks/tag-builder';
import { tagApi } from '@/features/purchase/api/tag-api';
import { useTags } from '@/features/purchase/core/use-tags';
import { useAuth } from '@/shared/hooks/use-auth';

jest.mock('@/features/purchase/api/tag-api');
jest.mock('@/shared/hooks/use-auth');

const mockService = jest.mocked(tagApi);
const mockUseAuth = jest.mocked(useAuth);

describe('tagQueries', () => {
  const tokenInfo = aTokenInfo();
  const mockTags = [aTagResponse()];
  const mockGetTags = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ tokenInfo } as any);
    mockGetTags.mockResolvedValue(anAxiosResponse(mockTags));
    mockService.mockReturnValue({
      getAll: mockGetTags,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockQueryClient.clear();
  });

  describe('createListQueryHook', () => {
    it('should create a working list query hook', async () => {
      const { result } = renderQueryHook(() => useTags());
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      expect(result.current.data?.length).toEqual(1);
      expect(result.current.data![0]).toEqual({
        ...mockTags[0],
        id: mockTags[0].tag,
      });
    });
  });
});
