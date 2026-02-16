import { Auth0Context, type Auth0ContextInterface } from 'react-native-auth0/src/hooks/Auth0Context';

export const createAuthContextForTest = (overrides?: Partial<Auth0ContextInterface>): Auth0ContextInterface => ({
  user: null,
  error: null,
  isLoading: false,
  authorize: jest.fn().mockResolvedValue(undefined),
  clearSession: jest.fn().mockResolvedValue(undefined),
  saveCredentials: jest.fn().mockResolvedValue(undefined),
  getCredentials: jest.fn().mockResolvedValue(undefined),
  hasValidCredentials: jest.fn().mockResolvedValue(false),
  clearCredentials: jest.fn().mockResolvedValue(undefined),
  getSSOCredentials: jest.fn().mockResolvedValue(undefined),
  getApiCredentials: jest.fn().mockResolvedValue(undefined),
  clearApiCredentials: jest.fn().mockResolvedValue(undefined),
  cancelWebAuth: jest.fn().mockResolvedValue(undefined),
  loginWithPasswordRealm: jest.fn().mockResolvedValue(undefined),
  createUser: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  authorizeWithExchange: jest.fn().mockResolvedValue(undefined),
  authorizeWithExchangeNativeSocial: jest.fn().mockResolvedValue(undefined),
  customTokenExchange: jest.fn().mockResolvedValue(undefined),
  sendEmailCode: jest.fn().mockResolvedValue(undefined),
  authorizeWithEmail: jest.fn().mockResolvedValue(undefined),
  sendSMSCode: jest.fn().mockResolvedValue(undefined),
  authorizeWithSMS: jest.fn().mockResolvedValue(undefined),
  sendMultifactorChallenge: jest.fn().mockResolvedValue(undefined),
  authorizeWithOOB: jest.fn().mockResolvedValue(undefined),
  authorizeWithOTP: jest.fn().mockResolvedValue(undefined),
  authorizeWithRecoveryCode: jest.fn().mockResolvedValue(undefined),
  revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
  getDPoPHeaders: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

export const AuthContextForTest = ({ children, overrides }: { children: React.ReactNode; overrides?: Partial<Auth0ContextInterface> }) => {
  return <Auth0Context.Provider value={createAuthContextForTest(overrides)}>{children}</Auth0Context.Provider>;
};
