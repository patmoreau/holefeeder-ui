import { type AxiosResponse } from 'axios';
import { StoreItem } from '@/features/dashboard/core/store-item';
import { PaginatedQueryParams } from '@/shared/hooks/queries/use-query';
import { apiService } from '@/shared/services/api-service';

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

  return {
    query,
  };
};
