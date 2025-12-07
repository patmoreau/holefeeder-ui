import axios, { type AxiosResponse } from 'axios';
import { config } from '@/config/config';

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

  const getWithAuth = <T>(url: string, options?: { params?: Record<string, any> }): Promise<AxiosResponse<T>> => {
    if (config.api.simulateNetworkDelay > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            api.get(url, {
              headers: { Authorization: `Bearer ${token}` },
              params: options?.params,
            })
          );
        }, config.api.simulateNetworkDelay);
      });
    }

    return api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: options?.params,
    });
  };

  const postWithAuth = <T>(url: string, data: T): Promise<AxiosResponse<T>> => {
    return api.post(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return {
    getWithAuth,
    postWithAuth,
  };
};
