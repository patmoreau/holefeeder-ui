import 'package:auth0_flutter/auth0_flutter_web.dart';
import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/enums/enums.dart';

import 'authentication_client.dart';

class WebAuthenticationClient extends AuthenticationClient {
  late Auth0Web _auth0;

  @override
  Future<void> init() async {
    _auth0 = Auth0Web(kAuth0Domain, kAuth0ClientId);
    setStatus(AuthenticationStatus.unauthenticated);
    try {
      await _auth0
          .onLoad(
            audience: kAuth0Audience,
            scopes: kAuth0Scopes,
            cookieDomain: kAuth0RedirectUriWeb,
            useRefreshTokens: true,
            cacheLocation: CacheLocation.localStorage,
            useCookiesForTransactions: true,
          )
          .then((final credentials) async {
            setCredentials(credentials);
            setStatus(
              credentials == null
                  ? AuthenticationStatus.unauthenticated
                  : AuthenticationStatus.authenticated,
            );
          });
    } catch (e) {
      // Handle missing_transaction error specifically
      // if (e.toString().contains('missing_transaction')) {
      //   // Clear any stale auth state
      //   await _clearAuthState();
      //   setStatus(AuthenticationStatus.unauthenticated);
      // } else {
      //   setError('Init error: $e');
      // }
      setError('Init error: $e');
    }
  }

  // Add this helper method
  Future<void> _clearAuthState() async {
    // Clear any local Auth0 state that might be corrupted
    try {
      // Try to clear session data gracefully
      await _auth0.logout(returnToUrl: null);
    } catch (e) {
      // Ignore errors during cleanup
    }

    // Reset the client state
    clear();
  }

  @override
  Future<void> login() async {
    setStatus(AuthenticationStatus.loading);
    try {
      await _auth0.loginWithRedirect(
        audience: kAuth0Audience,
        scopes: kAuth0Scopes,
        redirectUrl: kAuth0RedirectUriWeb,
      );
    } catch (e) {
      setError('Login error: $e');
    }
  }

  @override
  Future<void> signup() async {
    setStatus(AuthenticationStatus.loading);
    try {
      await _auth0.loginWithRedirect(
        audience: kAuth0Audience,
        scopes: kAuth0Scopes,
        redirectUrl: kAuth0RedirectUriWeb,
        parameters: AuthenticationClient.parameters,
      );
    } catch (e) {
      setError('Signup error: $e');
    }
  }

  @override
  Future<void> logout() async {
    setStatus(AuthenticationStatus.loading);
    try {
      await _auth0.logout(returnToUrl: kAuth0RedirectUriWeb);
      clear();
    } catch (e) {
      setError('Logout error: $e');
    }
  }

  @override
  Future<void> verifyAuthenticationStatus() async {
    if (currentStatus == AuthenticationStatus.unauthenticated) {
      setStatus(AuthenticationStatus.unauthenticated);
    }
  }

  @override
  Future<bool> isTokenExpired() async {
    try {
      if (currentStatus == AuthenticationStatus.unauthenticated) return true;

      // For web authentication, check the expiration time of the current token
      final expiresAt = credentials.expiresAt;

      return DateTime.now().isAfter(expiresAt);
    } catch (e) {
      setError('Token expiration check error: $e');
      return true;
    }
  }

  @override
  Future<void> refreshToken() async {
    try {
      if (currentStatus == AuthenticationStatus.unauthenticated) {
        throw Exception('No credentials available to refresh');
      }

      // Auth0Web will automatically handle token refresh
      final freshCredentials = await _auth0.onLoad(
        audience: kAuth0Audience,
        scopes: kAuth0Scopes,
        cookieDomain: kAuth0RedirectUriWeb,
        useRefreshTokens: true,
      );

      if (freshCredentials != null) {
        setCredentials(freshCredentials);
        setStatus(AuthenticationStatus.authenticated);
      } else {
        throw Exception('Failed to refresh token');
      }
    } catch (e) {
      setError('Token refresh error: $e');
      clear();
    }
  }
}
