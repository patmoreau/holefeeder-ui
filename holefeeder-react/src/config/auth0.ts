export const auth0Config = {
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-domain.auth0.com',
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-client-id',
  audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || '', // Optional: API audience
  redirectUri:
    process.env.EXPO_PUBLIC_AUTH0_REDIRECT_URI || 'holefeeder://auth',
  logoutRedirectUri:
    process.env.EXPO_PUBLIC_AUTH0_LOGOUT_REDIRECT_URI || 'holefeeder://auth',
  scope: 'openid profile email offline_access', // offline_access for refresh tokens
};
