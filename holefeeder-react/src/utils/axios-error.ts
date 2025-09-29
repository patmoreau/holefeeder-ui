import { AxiosError } from 'axios';

export const getAxiosErrorMessage = (error: unknown): string => {
  console.error(error);
  if (error instanceof AxiosError) {
    // If the server responded with an error status
    if (error.response) {
      const { status, data } = error.response;

      // Try to extract message from response data
      if (data && typeof data === 'object') {
        if ('message' in data && typeof data.message === 'string') {
          return `${status}: ${data.message}`;
        }
        if ('error' in data && typeof data.error === 'string') {
          return `${status}: ${data.error}`;
        }
        if ('detail' in data && typeof data.detail === 'string') {
          return `${status}: ${data.detail}`;
        }
      }

      // Fallback to status text
      return `${status}: ${error.response.statusText}`;
    }

    // If the request was made but no response was received
    if (error.request) {
      return 'Network error: No response received from server';
    }

    // If something else happened during request setup
    return `Request error: ${error.message}`;
  }

  // If it's not an axios error, return generic message
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error occurred';
};
