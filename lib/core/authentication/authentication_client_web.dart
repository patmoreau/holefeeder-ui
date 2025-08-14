import 'package:auth0_flutter/auth0_flutter_web.dart';
import 'package:holefeeder/core.dart';
import 'package:web/web.dart';

class AuthenticationClientImpl extends AuthenticationClient {
  late Auth0Web _auth0;
  late final Uri _redirectUri;
  late final String _cookieDomain;

  @override
  Future<void> init() async {
    final location = window.location;
    _redirectUri = Uri.parse('${location.origin}${location.pathname}');
    _cookieDomain = location.hostname;

    _auth0 = Auth0Web(kAuth0Domain, kAuth0ClientId);
    setStatus(AuthenticationStatus.unauthenticated);

    try {
      await load();
    } catch (e) {
      setError('Init error: $e');
    }
  }

  @override
  Future<void> login() async {
    setStatus(AuthenticationStatus.loading);
    try {
      await _auth0.loginWithRedirect(
        audience: kAuth0Audience,
        scopes: kAuth0Scopes,
        redirectUrl: _redirectUri.toString(),
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
        redirectUrl: _redirectUri.toString(),
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
      await _auth0.logout(returnToUrl: _redirectUri.toString());
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

      await load();
    } catch (e) {
      setError('Token refresh error: $e');
      clear();
    }
  }

  Future<void> load() async {
    final credentials = await _auth0.onLoad(
      audience: kAuth0Audience,
      scopes: kAuth0Scopes,
      cookieDomain: _cookieDomain,
      useRefreshTokens: true,
      cacheLocation: CacheLocation.localStorage,
      useCookiesForTransactions: true,
    );

    // remove Auth0 query params if present
    final location = window.location;
    if (location.search.isNotEmpty) {
      window.history.replaceState(null, document.title, location.pathname);
    }

    if (credentials != null) {
      setCredentials(credentials);
      setStatus(AuthenticationStatus.authenticated);
    } else {
      setStatus(AuthenticationStatus.unauthenticated);
    }
  }
}
