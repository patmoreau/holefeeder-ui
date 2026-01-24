import { type AxiosResponse } from 'axios';
import { StoreItem } from '@/features/settings/core/store-item';
import { apiService } from '@/shared/api/api-service';
import { PaginatedQueryParams } from '@/shared/hooks/queries/use-query';

export type StoreItemFilter = {
  code?: string;
};

export const storeItemApi = (token: string | null) => {
  const api = apiService(token);

  const query = (queryParams: PaginatedQueryParams<StoreItemFilter> | null): Promise<AxiosResponse<StoreItem[]>> => {
    const params: Record<string, string> = {};

    if (queryParams?.filter?.code) {
      params.filter = `code:eq:${queryParams.filter.code}`;
    }

    return api.getWithAuth<StoreItem[]>('/api/v2/store-items', { params });
  };

  const create = (code: string, data: string): Promise<AxiosResponse> =>
    api.postWithAuth('/api/v2/store-items/create-store-item', { code, data });

  const modify = (id: string, data: string): Promise<AxiosResponse> => api.postWithAuth('/api/v2/store-items/modify-store-item', { id, data });

  return {
    query,
    create,
    modify,
  };
};
