import { aBoolean, aTokenInfo } from '@/__tests__';
import { AuthState } from '@/types/auth-state';

const defaultAuthState = (): AuthState => ({
  tokenInfo: aTokenInfo(),
  isLoading: aBoolean(),
  isReady: aBoolean(),
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const aAuthState = (overrides: Partial<AuthState> = {}) => ({
  ...defaultAuthState(),
  ...overrides,
});
