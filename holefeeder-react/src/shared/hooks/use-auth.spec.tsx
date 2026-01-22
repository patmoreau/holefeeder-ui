import { renderHook, waitFor } from '@testing-library/react-native';
import { Credentials } from 'react-native-auth0';
import { AuthContextForTest } from '@/__tests__/AuthContextForTest';
import { useAuth } from '@/shared/hooks/use-auth';

describe('useAuth', () => {
  const mockCredentials: Credentials = {
    accessToken: 'mock-access-token',
    idToken: 'mock-id-token',
    tokenType: 'Bearer',
    expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    scope: 'openid profile email',
  };

  it('should initialize with loading state', () => {
    const mockGetCredentials = jest.fn().mockResolvedValue(mockCredentials);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContextForTest
          overrides={{
            user: null,
            isLoading: true,
            getCredentials: mockGetCredentials,
          }}
        >
          {children}
        </AuthContextForTest>
      ),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should return user and token info when authenticated', async () => {
    const mockUser = {
      sub: 'auth0|123456',
      email: 'test@example.com',
      name: 'Test User',
    };

    const mockGetCredentials = jest.fn().mockResolvedValue(mockCredentials);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContextForTest
          overrides={{
            user: mockUser,
            isLoading: false,
            getCredentials: mockGetCredentials,
          }}
        >
          {children}
        </AuthContextForTest>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.tokenInfo.accessToken).toBe('mock-access-token');
  });

  it('should call authorize on login', async () => {
    const mockAuthorize = jest.fn().mockResolvedValue(mockCredentials);
    const mockGetCredentials = jest.fn().mockResolvedValue(mockCredentials);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContextForTest
          overrides={{
            user: null,
            isLoading: false,
            authorize: mockAuthorize,
            getCredentials: mockGetCredentials,
          }}
        >
          {children}
        </AuthContextForTest>
      ),
    });

    await result.current.login();

    expect(mockAuthorize).toHaveBeenCalled();
  });

  it('should call clearSession on logout', async () => {
    const mockClearSession = jest.fn().mockResolvedValue(undefined);
    const mockGetCredentials = jest.fn().mockResolvedValue(mockCredentials);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContextForTest
          overrides={{
            user: { sub: 'auth0|123456', email: 'test@example.com' },
            isLoading: false,
            clearSession: mockClearSession,
            getCredentials: mockGetCredentials,
          }}
        >
          {children}
        </AuthContextForTest>
      ),
    });

    await result.current.logout();

    expect(mockClearSession).toHaveBeenCalled();
  });

  it('should handle missing user gracefully', async () => {
    const mockGetCredentials = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContextForTest
          overrides={{
            user: null,
            isLoading: false,
            getCredentials: mockGetCredentials,
          }}
        >
          {children}
        </AuthContextForTest>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.tokenInfo.accessToken).toBeNull();
  });
});
