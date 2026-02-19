import { aBoolean } from '@/__tests__/mocks/boolean-for-test';
import { aTokenInfo } from '@/__tests__/mocks/token-info-builder';
import { AuthState } from '@/types/auth-state';

const defaultAuthState = (): AuthState => ({
  tokenInfo: aTokenInfo(),
  isLoading: aBoolean(),
  isReady: aBoolean(),
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getCredentials: () => Promise.resolve({ accessToken: 'mock-token' } as any),
});

export const aAuthState = (overrides: Partial<AuthState> = {}) => ({
  ...defaultAuthState(),
  ...overrides,
});
