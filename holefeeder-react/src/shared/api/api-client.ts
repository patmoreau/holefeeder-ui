import { ApiConfig } from '@/shared/api/api-config';
import { AuthenticationState } from '@/shared/auth/core/autentication-state';
import { Logger } from '@/shared/core/logger/logger';
import { Result } from '@/shared/core/result';

const logger = Logger.create('api-client');

export type ApiClient = {
  post: <TInput, TOutput>(endpoint: string, data?: TInput, req?: RequestInit) => Promise<Result<TOutput>>;
};

export const ApiClient = (authenticationState: AuthenticationState, apiConfig: ApiConfig): ApiClient => {
  const executeFetch = async (endpoint: string, init: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

    try {
      return await fetch(new URL(endpoint, apiConfig.url).toString(), {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const callApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<Result<T>> => {
    try {
      const token = await authenticationState.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token.token}` } : {}),
      };

      if (apiConfig.logRequests) {
        logger.debug('Request:', { endpoint, method: 'POST', headers, body: options.body });
      }

      const doFetch = () =>
        executeFetch(endpoint, {
          ...options,
          headers,
        });

      const response =
        apiConfig.simulateNetworkDelay > 0
          ? await new Promise<Response>((resolve) => setTimeout(() => resolve(doFetch()), apiConfig.simulateNetworkDelay))
          : await doFetch();

      if (apiConfig.logRequests) {
        if (response.ok) {
          logger.debug('Response:', { status: response.status, headers: Object.fromEntries(response.headers) });
        } else {
          logger.error('Error Response:', { status: response.status, headers: Object.fromEntries(response.headers) });
        }
      }

      if (!response.ok) {
        return Result.failure([response.statusText]);
      }

      const data = await response.json();
      return Result.success(data as T);
    } catch (error) {
      const apiError = error as Error;
      return Result.failure([apiError.message]);
    }
  };

  const post = async <TInput, TOutput>(endpoint: string, data?: TInput, req?: RequestInit): Promise<Result<TOutput>> => {
    const body = data ? JSON.stringify(data) : undefined;
    return callApi<TOutput>(endpoint, { ...req, method: 'POST', body });
  };

  return {
    post: post,
  };
};
