import { AxiosResponse, AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios';

const defaultData = {
  data: '',
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {} as any,
  request: null,
}

export const anAxiosResponse = <T>(data: T, overrides: Partial<AxiosResponse<T>> = {}): AxiosResponse<T> => ({
  ...defaultData,
  ...overrides,
  data,
});
