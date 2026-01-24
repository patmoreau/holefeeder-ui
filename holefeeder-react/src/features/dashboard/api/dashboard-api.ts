import { type AxiosResponse } from 'axios';
import { Summary } from '@/features/dashboard/core/summary';
import { apiService } from '@/shared/api/api-service';

export const dashboardApi = (token: string | null) => {
  const api = apiService(token);

  const query = (): Promise<AxiosResponse<Summary>> => {
    return api.getWithAuth<Summary>('/api/v2/dashboard/summary');
  };

  return {
    query,
  };
};
