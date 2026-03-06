import { config } from '@/config/config';

const fetchWithBase = async (url: string, init: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

  try {
    const response = await fetch(`${config.api.baseUrl}${url}`, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const apiService = (token: string | null) => {
  const postWithAuth = async <T>(url: string, data: T): Promise<void> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const body = JSON.stringify(data);

    if (config.api.logRequest) {
      console.log('Request:', { url, method: 'POST', headers, data });
    }

    const doFetch = () => fetchWithBase(url, { method: 'POST', headers, body });

    const response =
      config.api.simulateNetworkDelay > 0
        ? await new Promise<Response>((resolve) => setTimeout(() => resolve(doFetch()), config.api.simulateNetworkDelay))
        : await doFetch();

    if (config.api.logRequest) {
      if (response.ok) {
        console.log('Response:', { status: response.status, headers: Object.fromEntries(response.headers) });
      } else {
        let data: unknown;
        try {
          data = await response.clone().json();
        } catch {
          data = await response.clone().text();
        }
        console.log('Error Response:', { status: response.status, data, headers: Object.fromEntries(response.headers) });
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  };

  return {
    postWithAuth,
  };
};
