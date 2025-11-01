import { type AxiosResponse } from 'axios';
import { TagResponse } from '@/features/purchase/core/tag';
import { apiService } from '@/shared/services/api-service';

export const tagApi = (token: string | null) => {
  const api = apiService(token);

  const getAll = (): Promise<AxiosResponse<TagResponse[]>> => api.getWithAuth<TagResponse[]>('/api/v2/tags');

  return {
    getAll,
  };
};
