import { isAxiosError } from 'axios';
import { isNetworkError } from './is-network-error';

// Mock only what we need from axios
jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}));

describe('isNetworkError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns false for nullish values', () => {
    expect(isNetworkError(null as unknown as Error)).toBe(false);
    expect(isNetworkError(undefined as unknown as Error)).toBe(false);
  });

  it('returns false for non-error arbitrary values', () => {
    expect(isNetworkError(42 as unknown as Error)).toBe(false);
    expect(isNetworkError({} as unknown as Error)).toBe(false);
    expect(isNetworkError(['a'] as unknown as Error)).toBe(false);
  });

  it('detects generic Error messages that indicate network issues', () => {
    expect(isNetworkError(new Error('Network error occurred'))).toBe(true);
    expect(isNetworkError(new Error('failed to fetch'))).toBe(true);
    expect(isNetworkError(new Error('Load Failed'))).toBe(true);
    expect(isNetworkError(new Error('Timeout while waiting'))).toBe(true);
  });

  it('returns false for generic Error not related to network connectivity', () => {
    expect(isNetworkError(new Error('Internal server error'))).toBe(false);
    expect(isNetworkError(new Error('Bad request'))).toBe(false);
  });

  it('treats axios error with no response as network error', () => {
    (isAxiosError as jest.Mock).mockReturnValue(true);
    const error = { message: 'Something', code: 'SOME_CODE', response: undefined } as any;
    expect(isNetworkError(error)).toBe(true);
  });

  it('treats axios error with known network codes as network error', () => {
    (isAxiosError as jest.Mock).mockReturnValue(true);

    for (const code of ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT']) {
      const error = { message: 'Something', code, response: {} } as any;
      expect(isNetworkError(error)).toBe(true);
    }
  });

  it('falls back to axios error message matching when response exists', () => {
    (isAxiosError as jest.Mock).mockReturnValue(true);
    const error = { message: 'Network Error', response: { status: 500 } } as any;
    expect(isNetworkError(error)).toBe(true);
  });

  it('returns false for axios error that is not a network issue', () => {
    (isAxiosError as jest.Mock).mockReturnValue(true);
    const error = { message: 'Request failed with status code 500', code: 'ERR_BAD_RESPONSE', response: { status: 500 } } as any;
    expect(isNetworkError(error)).toBe(false);
  });
});
