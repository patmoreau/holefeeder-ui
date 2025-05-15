import 'dart:async';

import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:auth0_flutter/auth0_flutter_web.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/constants/strings.dart';
import 'package:rxdart/rxdart.dart';

import 'package:holefeeder/core/enums/authentication_status_enum.dart';

abstract class AuthenticationClient {
  static const parameters = {'screen_hint': 'signup'};

  final _statusController = BehaviorSubject<AuthenticationStatus>();

  Credentials? _credentials;
  String? _errorMessage;

  AuthenticationStatus _currentStatus = AuthenticationStatus.unauthenticated;
  AuthenticationStatus get currentStatus => _currentStatus;

  Stream<AuthenticationStatus> get statusStream => _statusController.stream;

  Credentials get credentials => _credentials!;

  UserProfile get userProfile =>
      _credentials?.user ?? UserProfile(sub: 'Unknown');

  String? get errorMessage => _errorMessage;

  @protected
  void setCredentials(Credentials? credentials) {
    _credentials = credentials;
  }

  @protected
  void setStatus(AuthenticationStatus status) {
    _currentStatus = status;
    _statusController.add(status);
  }

  @protected
  void setError(String message) {
    debugPrint('AuthService error: $message');
    _errorMessage = message;
    setStatus(AuthenticationStatus.error);
  }

  @protected
  void clear() {
    _credentials = null;
    _errorMessage = null;
    setStatus(AuthenticationStatus.unauthenticated);
  }

  Future<void> init();

  Future<void> login();

  Future<void> signup();

  Future<void> logout();

  Future<void> verifyAuthenticationStatus();
}

class MobileAuthenticationClient extends AuthenticationClient {
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
}

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
    if (_credentials == null) {
      setStatus(AuthenticationStatus.unauthenticated);
    }
  }
}
