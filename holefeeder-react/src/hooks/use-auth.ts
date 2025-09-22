/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { Credentials, useAuth0 } from 'react-native-auth0';
import { TokenInfo } from '@/types';
import { auth0Config } from '@/config';

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

  const updateTokenInfo = (credentials: Credentials) => {
    setTokenInfo({
      accessToken: `${credentials.accessToken.substring(0, 20)}...`,
      expiresAt: new Date(credentials.expiresAt * 1000).toLocaleString(),
      issuedAt: credentials.issuedAt
        ? new Date(credentials.issuedAt * 1000).toLocaleString()
        : null,
      refreshToken: true,
    });
  };

  const resetTokenInfo = (error: string | null = null) => {
    setTokenInfo({
      accessToken: error,
      expiresAt: null,
      issuedAt: null,
      refreshToken: false,
    });
  };

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
  }, [memoizedUser, authLoading, getCredentials]);

  const login = async () => {
    await authorize({
      scope: auth0Config.scope,
      audience: auth0Config.audience,
      redirectUrl: auth0Config.redirectUri,
    });
  };

  const logout = async () => {
    await clearSession(
      {
        returnToUrl: auth0Config.logoutRedirectUri,
      },
      {}
    );
  };

  return {
    tokenInfo,
    isLoading,
    user: memoizedUser,
    login,
    logout,
  };
}
