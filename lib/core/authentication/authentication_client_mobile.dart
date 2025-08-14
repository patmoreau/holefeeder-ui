// ignore: unused_import
import 'dart:io';

import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:holefeeder/core.dart';

class AuthenticationClientImpl extends AuthenticationClient {
  final Auth0 _auth0 = Auth0(kAuth0Domain, kAuth0ClientId);

  @override
  Future<void> init() async {
    try {
      final isLoggedIn = await _auth0.credentialsManager.hasValidCredentials();
      if (isLoggedIn) {
        final credentials = await _auth0.credentialsManager.credentials();
        setCredentials(credentials);
        setStatus(AuthenticationStatus.authenticated);
      } else {
        setStatus(AuthenticationStatus.unauthenticated);
      }
    } catch (e) {
      setError('Init error: $e');
    }
  }

  @override
  Future<void> login() async {
    setStatus(AuthenticationStatus.loading);
    try {
      final credentials = await _auth0.webAuthentication().login(
        audience: kAuth0Audience,
        scopes: kAuth0Scopes,
      );
      setCredentials(credentials);
      setStatus(AuthenticationStatus.authenticated);
    } catch (e) {
      setError('Login error: $e');
    }
  }

  @override
  Future<void> signup() async {
    setStatus(AuthenticationStatus.loading);
    try {
      final credentials = await _auth0.webAuthentication().login(
        audience: kAuth0Audience,
        scopes: kAuth0Scopes,
        parameters: AuthenticationClient.parameters,
      );
      setCredentials(credentials);
      setStatus(AuthenticationStatus.authenticated);
    } catch (e) {
      setError('Signup error: $e');
    }
  }

  @override
  Future<void> logout() async {
    setStatus(AuthenticationStatus.loading);
    try {
      await _auth0.webAuthentication().logout();
      clear();
    } catch (e) {
      setError('Logout error: $e');
    }
  }

  @override
  Future<void> verifyAuthenticationStatus() async {
    try {
      final hasValidCredentials =
          await _auth0.credentialsManager.hasValidCredentials();
      if (!hasValidCredentials) {
        clear();
      }
    } catch (e) {
      setError('Verification error: $e');
    }
  }

  @override
  Future<bool> isTokenExpired() async {
    try {
      if (currentStatus == AuthenticationStatus.unauthenticated) return true;

      final hasValidCredentials =
          await _auth0.credentialsManager.hasValidCredentials();
      return !hasValidCredentials;
    } catch (e) {
      setError('Token expiration check error: $e');
      return true;
    }
  }

  @override
  Future<void> refreshToken() async {
    try {
      if (currentStatus == AuthenticationStatus.unauthenticated) {
        return await login();
      }

      final freshCredentials = await _auth0.credentialsManager.credentials();
      setCredentials(freshCredentials);
      setStatus(AuthenticationStatus.authenticated);
    } catch (e) {
      setError('Token refresh error: $e');
      clear();
    }
  }
}
