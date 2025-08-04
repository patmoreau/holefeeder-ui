import 'package:holefeeder/core/events/events.dart';
import 'package:provider/provider.dart';

import '../../ui/services/services.dart';
import '../authentication/authentication.dart';
import '../network/network.dart';
import 'api_service.dart';
import 'api_service_impl.dart';
import 'hive_service.dart';
import 'hive_service_impl.dart';
import 'notification_service.dart';
import 'pending_actions_service.dart';
import 'period_service.dart';
import 'period_service_impl.dart';
import 'quick_actions_service.dart';
import 'quick_actions_service_impl.dart';

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
  ProxyProvider<EventBus, PeriodService>(
    update: (_, eventBus, _) => PeriodServiceImpl(eventBus: eventBus),
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
