import 'authentication_client.dart';

class AuthenticationClientImpl extends AuthenticationClient {
  @override
  Future<void> init() {
    throw UnimplementedError(
      'AuthenticationClientImpl.init() is not implemented for stub.',
    );
  }

  @override
  Future<void> login() {
    throw UnimplementedError(
      'AuthenticationClientImpl.login() is not implemented for stub.',
    );
  }

  @override
  Future<void> signup() {
    throw UnimplementedError(
      'AuthenticationClientImpl.signup() is not implemented for stub.',
    );
  }

  @override
  Future<void> logout() {
    throw UnimplementedError(
      'AuthenticationClientImpl.logout() is not implemented for stub.',
    );
  }

  @override
  Future<void> verifyAuthenticationStatus() {
    throw UnimplementedError(
      'AuthenticationClientImpl.verifyAuthenticationStatus() is not implemented for stub.',
    );
  }

  @override
  Future<bool> isTokenExpired() {
    throw UnimplementedError(
      'AuthenticationClientImpl.isTokenExpired() is not implemented for stub.',
    );
  }

  @override
  Future<void> refreshToken() {
    throw UnimplementedError(
      'AuthenticationClientImpl.refreshToken() is not implemented for stub.',
    );
  }
}
