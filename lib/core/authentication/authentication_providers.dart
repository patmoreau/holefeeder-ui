import 'package:provider/provider.dart';

import 'authentication_client.dart';
import 'authentication_client_factory.dart';

final authenticationProviders = [
  FutureProvider<AuthenticationClient>(
    create: (context) async {
      final service = AuthenticationClientFactory.instance;
      await service.init();
      return service;
    },
    initialData: AuthenticationClientFactory.instance,
  ),
];
