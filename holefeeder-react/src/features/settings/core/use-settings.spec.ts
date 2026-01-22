import { waitFor } from '@testing-library/react-native';
import { anAxiosResponse } from '@/__tests__/mocks/axios-response-builder';
import { mockQueryClient, renderQueryHook } from '@/__tests__/mocks/mock-query-client';
import { aTokenInfo } from '@/__tests__/mocks/token-info-builder';
import { storeItemApi } from '@/features/settings/api/store-item-api';
import { Settings } from '@/features/settings/core/settings';
import { useUpdateSettings } from '@/features/settings/core/use-settings';
import { useAuth } from '@/shared/hooks/use-auth';

jest.mock('@/features/settings/api/store-item-api');
jest.mock('@/shared/hooks/use-auth');

const mockService = jest.mocked(storeItemApi);
const mockUseAuth = jest.mocked(useAuth);

describe('settingsMutation', () => {
  const tokenInfo = aTokenInfo();
  const mockCreate = jest.fn();
  const mockModify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ tokenInfo } as any);
    mockCreate.mockResolvedValue(anAxiosResponse({}));
    mockModify.mockResolvedValue(anAxiosResponse({}));
    mockService.mockReturnValue({
      create: mockCreate,
      modify: mockModify,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockQueryClient.clear();
  });

  describe('createMutationHook', () => {
    it('should call create when storeItemId is undefined', async () => {
      const settings: Settings = {
        effectiveDate: '2024-01-01',
        intervalType: 'monthly',
        frequency: 1,
      };

      const { result } = renderQueryHook(() => useUpdateSettings());

      result.current.mutate(settings);

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockCreate).toHaveBeenCalledWith(
        'settings',
        JSON.stringify({
          effectiveDate: '2024-01-01',
          intervalType: 'monthly',
          frequency: 1,
        })
      );
      expect(mockModify).not.toHaveBeenCalled();
    });

    it('should call modify when storeItemId is provided', async () => {
      const settings: Settings = {
        storeItemId: 'test-id-123',
        effectiveDate: '2024-01-01',
        intervalType: 'weekly',
        frequency: 2,
      };

      const { result } = renderQueryHook(() => useUpdateSettings());

      result.current.mutate(settings);

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(mockModify).toHaveBeenCalledWith(
        'test-id-123',
        JSON.stringify({
          effectiveDate: '2024-01-01',
          intervalType: 'weekly',
          frequency: 2,
        })
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should exclude storeItemId from the JSON data', async () => {
      const settings: Settings = {
        storeItemId: 'test-id-456',
        effectiveDate: '2024-06-15',
        intervalType: 'yearly',
        frequency: 1,
      };

      const { result } = renderQueryHook(() => useUpdateSettings());

      result.current.mutate(settings);

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      const sentData = JSON.parse(mockModify.mock.calls[0][1]);
      expect(sentData).toEqual({
        effectiveDate: '2024-06-15',
        intervalType: 'yearly',
        frequency: 1,
      });
      expect(sentData.storeItemId).toBeUndefined();
    });
  });
});
