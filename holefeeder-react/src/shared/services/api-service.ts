import axios, { type AxiosResponse } from 'axios';
import { config } from '@/config/config';
import { Account } from '@/core/account';
import { Category } from '@/core/category';

export const apiService = (token: string | null) => {
  const api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (config.api.logRequest) {
    api.interceptors.request.use((request) => {
      console.log('Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.data,
        baseURL: request.baseURL,
      });
      return request;
    });

    api.interceptors.response.use(
      (response) => {
        console.log('Response:', {
          status: response.status,
          data: response.data,
          headers: response.headers,
        });
        return response;
      },
      (error) => {
        if (error.response) {
          console.log('Error Response:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        } else {
          console.log('Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  const getWithAuth = <T>(url: string): Promise<AxiosResponse<T>> =>
    api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const getAccounts = () => getWithAuth<Account[]>('/api/v2/accounts');

  const getCategories = () => getWithAuth<Category[]>('/api/v2/categories');

  const getCategory = (id: string) => getWithAuth<Category>(`/api/v2/categories/${id}`);

  return {
    getAccounts,
    getCategories,
    getCategory,
  };
};
