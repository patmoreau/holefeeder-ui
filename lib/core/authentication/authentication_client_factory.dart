import 'authentication_client.dart';
import 'authentication_client_stub.dart'
    if (dart.library.io) 'authentication_client_mobile.dart'
    if (dart.library.html) 'authentication_client_web.dart'
    as client;

class AuthenticationClientFactory {
  static AuthenticationClient? _instance;

  static AuthenticationClient get instance {
    _instance ??= client.AuthenticationClientImpl();
    return _instance!;
  }
}
