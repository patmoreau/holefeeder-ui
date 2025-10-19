import { type AxiosResponse } from 'axios';
import { Account } from '@/features/purchase/core/account';
import { apiService } from '@/shared/services/api-service';

export const accountApi = (token: string | null) => {
  const api = apiService(token);

  const getAll = (): Promise<AxiosResponse<Account[]>> =>
    api.getWithAuth<Account[]>('/api/v2/accounts?sort=-favorite&sort=name&filter=inactive:eq:false');

  return {
    getAll,
  };
};
