import { AxiosError, isAxiosError } from 'axios';

/**
 * Returns true when the error is likely due to network connectivity issues
 * (offline, DNS, CORS/network layer, or timeout) rather than an application/server error.
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  // Axios-specific checks
  if (isAxiosError(error)) {
    const e = error as AxiosError;
    // No response from server indicates network issue (request never reached or no reply)
    if (!e.response) return true;
    // Known Axios error codes for network problems
    if (e.code === 'ERR_NETWORK' || e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') return true;
    // Some platforms only set message
    return /network error|timeout/i.test(e.message);
  }

  // Fallback for generic errors
  if (error instanceof Error) {
    return /network error|failed to fetch|load failed|timeout/i.test(error.message);
  }

  return false;
}
