import { useState, useEffect, useMemo, useCallback } from 'react';
import { Credentials, useAuth0 } from 'react-native-auth0';
import { TokenInfo } from '@/types';
import { config } from '@/config';

export function useAuth() {
  const {
    user,
    getCredentials,
    isLoading: authLoading,
    authorize,
    clearSession,
  } = useAuth0();

  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    accessToken: null,
    expiresAt: null,
    issuedAt: null,
    refreshToken: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const memoizedUser = useMemo(() => user, [user?.sub]);

  const updateTokenInfo = useCallback((credentials: Credentials) => {
    setTokenInfo({
      accessToken: credentials.accessToken,
      expiresAt: new Date(credentials.expiresAt * 1000).toLocaleString(),
      issuedAt: credentials.issuedAt
        ? new Date(credentials.issuedAt * 1000).toLocaleString()
        : null,
      refreshToken: true,
    });
  }, []);

  const resetTokenInfo = useCallback((error: string | null = null) => {
    setTokenInfo({
      accessToken: error,
      expiresAt: null,
      issuedAt: null,
      refreshToken: false,
    });
  }, []);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      if (!memoizedUser) {
        resetTokenInfo();
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const credentials = await getCredentials();
        if (!credentials?.accessToken) {
          resetTokenInfo();
        } else {
          updateTokenInfo(credentials);
        }
      } catch (error: any) {
        resetTokenInfo(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfo();
  }, [memoizedUser, authLoading]); // Remove getCredentials from deps

  const login = useCallback(async () => {
    await authorize({
      scope: config.auth0.scope,
      audience: config.auth0.audience,
      redirectUrl: config.auth0.redirectUri,
    });
  }, [authorize]);

  const logout = useCallback(async () => {
    await clearSession({ returnToUrl: config.auth0.logoutRedirectUri }, {});
  }, [clearSession]);

  return {
    tokenInfo,
    isLoading,
    isReady: !isLoading && !!tokenInfo.accessToken,
    user: memoizedUser,
    login,
    logout,
  };
}
