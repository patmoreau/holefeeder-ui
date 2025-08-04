import 'package:provider/provider.dart';

import '../authentication/authentication_client.dart';
import '../constants/constants.dart';
import 'dio_client.dart';
import 'rest_client.dart';

final networkProviders = [
  ProxyProvider<AuthenticationClient, RestClient>(
    update:
        (context, authClient, _) =>
            RestClient(DioClient.getInstance(authClient), baseUrl: kServerUrl),
  ),
];
