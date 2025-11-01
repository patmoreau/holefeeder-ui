import { type AxiosResponse } from 'axios';
import { Category } from '@/features/purchase/core/category';
import { apiService } from '@/shared/services/api-service';

export const categoryApi = (token: string | null) => {
  const api = apiService(token);

  const getAll = (): Promise<AxiosResponse<Category[]>> => api.getWithAuth<Category[]>('/api/v2/categories');

  const getById = (id: string): Promise<AxiosResponse<Category>> => api.getWithAuth<Category>(`/api/v2/categories/${id}`);

  return {
    getAll,
    getById,
  };
};
