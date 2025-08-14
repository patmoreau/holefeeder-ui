import 'dart:async';
import 'dart:developer' as developer;

import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:rxdart/rxdart.dart';

abstract class AuthenticationClient {
  static const parameters = {'screen_hint': 'signup'};

  final _statusController = BehaviorSubject<AuthenticationStatus>();

  Credentials? _credentials;
  String? _errorMessage;

  AuthenticationStatus _currentStatus = AuthenticationStatus.unauthenticated;

  AuthenticationStatus get currentStatus => _currentStatus;

  bool get isAuthenticated =>
      _currentStatus == AuthenticationStatus.authenticated;

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
    developer.log('Error: $message', name: 'AuthenticationClient');
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
