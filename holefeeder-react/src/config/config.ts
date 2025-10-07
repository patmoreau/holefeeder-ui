import { Platform } from 'react-native';

export const config = {
  auth0: {
    domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-domain.auth0.com',
    clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-client-id',
    audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || '',
    redirectUri:
      Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_AUTH0_WEB_REDIRECT_URI ||
          'http://localhost:19006'
        : Platform.OS === 'android'
          ? process.env.EXPO_PUBLIC_AUTH0_ANDROID_REDIRECT_URI ||
            'com.drifterapps.holefeeder_react://auth'
          : process.env.EXPO_PUBLIC_AUTH0_IOS_REDIRECT_URI ||
            'holefeeder://auth',
    logoutRedirectUri:
      Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_AUTH0_WEB_LOGOUT_REDIRECT_URI ||
          'http://localhost:19006'
        : Platform.OS === 'android'
          ? process.env.EXPO_PUBLIC_AUTH0_ANDROID_LOGOUT_REDIRECT_URI ||
            'com.drifterapps.holefeeder_react://auth'
          : process.env.EXPO_PUBLIC_AUTH0_IOS_LOGOUT_REDIRECT_URI ||
            'holefeeder://auth',
    scope: 'openid profile email offline_access',
  },
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
    logRequest: process.env.EXPO_PUBLIC_API_LOG_REQUEST === 'true',
  },
};
