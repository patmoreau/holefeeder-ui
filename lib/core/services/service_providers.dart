import 'package:provider/provider.dart';

import '../../ui/services/services.dart';
import '../authentication/authentication.dart';
import '../network/network.dart';
import 'api_service.dart';
import 'hive_service.dart';
import 'notification_service.dart';
import 'pending_actions_service.dart';
import 'period_service.dart';
import 'quick_actions_service.dart';

final serviceProviders = [
  Provider<ApiService>(
    create:
        (context) =>
            ApiServiceImpl(Provider.of<RestClient>(context, listen: false)),
  ),
  Provider<HiveService>(create: (context) => HiveServiceImpl.instance),
  Provider<NotificationService>(
    create: (context) => NotificationServiceImpl(context),
  ),
  ProxyProvider<HiveService, PendingActionsService>(
    update:
        (context, hiveService, _) =>
            PendingActionsServiceImpl(hiveService: hiveService),
  ),
  ProxyProvider<ApiService, PeriodService>(
    update: (_, apiService, _) => PeriodServiceImpl(apiService: apiService),
  ),
  Provider<QuickActionsService>(
    create:
        (context) => QuickActionsServiceImpl(
          Provider.of<AuthenticationClient>(context, listen: false),
          Provider.of<PendingActionsService>(context, listen: false),
        ),
    lazy: false,
  ),
];
