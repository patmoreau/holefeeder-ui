import 'package:holefeeder/core/authentication.dart';
import 'package:holefeeder/core/constants.dart';
import 'package:provider/provider.dart';

import 'dio_client.dart';
import 'rest_client.dart';

final networkProviders = [
  ProxyProvider<AuthenticationClient, RestClient>(
    update:
        (context, authClient, _) =>
            RestClient(DioClient.getInstance(authClient), baseUrl: kServerUrl),
  ),
];
