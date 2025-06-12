import 'dart:async';

import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/enums/authentication_status_enum.dart';
import 'package:rxdart/rxdart.dart';

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

  void dispose() {
    _statusController.close();
  }

  Future<void> init();

  Future<void> login();

  Future<void> signup();

  Future<void> logout();

  Future<void> verifyAuthenticationStatus();

  Future<bool> isTokenExpired();

  Future<void> refreshToken();
}
