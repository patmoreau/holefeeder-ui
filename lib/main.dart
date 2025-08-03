import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/network/dio_client.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/pending_actions_service.dart';
import 'package:holefeeder/core/services/quick_actions_service.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/notification_service.dart';
import 'package:provider/provider.dart';

import 'app/holefeeder_app.dart';

const appScheme = 'https';

Future<void> main() async {
  usePathUrlStrategy();
  await dotenv.load(
    fileName: 'assets/env/.env.${kReleaseMode ? "production" : "development"}',
  );
  WidgetsFlutterBinding.ensureInitialized();

  runApp(_registerProviders(const HolefeederApp()));
}

MultiProvider _registerProviders(Widget? child) => MultiProvider(
  providers: [
    // register singletons
    Provider<HiveStorageProvider>(
      create: (context) => HiveStorageProviderImpl.instance,
    ),
    FutureProvider<AuthenticationClient>(
      create: (context) async {
        final service = AuthenticationClientFactory.instance;
        await service.init();
        return service;
      },
      initialData: AuthenticationClientFactory.instance,
    ),
    ProxyProvider<HiveStorageProvider, PendingActionsService>(
      update:
          (context, hiveService, _) =>
              PendingActionsServiceImpl(hiveService: hiveService),
    ),
    Provider<QuickActionsService>(
      create:
          (context) => QuickActionsServiceImpl(
            Provider.of<AuthenticationClient>(context, listen: false),
            Provider.of<PendingActionsService>(context, listen: false),
          ),
      lazy: false,
    ),
    Provider<EventBus>(create: (BuildContext context) => EventBus()),
    ProxyProvider<AuthenticationClient, RestClient>(
      update:
          (context, authClient, _) => RestClient(
            DioClient.getInstance(authClient),
            baseUrl: kServerUrl,
          ),
    ),
    Provider<DataProvider>(
      create:
          (BuildContext context) =>
              DataProviderImpl(Provider.of<RestClient>(context, listen: false)),
    ),
    Provider<RepositoryFactory>(
      create: (BuildContext context) => RepositoryFactory(),
      dispose: (_, service) => service.dispose(),
    ),
    Provider<AppLifecycleService>(
      create:
          (BuildContext context) => AppLifecycleService(
            Provider.of<RepositoryFactory>(context, listen: false),
          ),
      dispose: (_, service) => service.dispose(),
      lazy:
          false, // Important: create immediately to register lifecycle observer
    ),
    ProxyProvider3<
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      UserSettingsRepository
    >(
      update:
          (_, hiveService, dataProvider, factory, _) => factory.getRepository(
            () => UserSettingsRepository(
              hiveService: hiveService,
              dataProvider: dataProvider,
            ),
          ),
    ),
    ProxyProvider3<
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      CashflowRepository
    >(
      update:
          (_, hiveService, dataProvider, factory, _) => factory.getRepository(
            () => CashflowRepository(
              hiveService: hiveService,
              dataProvider: dataProvider,
            ),
          ),
    ),
    ProxyProvider3<
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      AccountRepository
    >(
      update:
          (_, hiveService, dataProvider, factory, _) => factory.getRepository(
            () => AccountRepository(
              hiveService: hiveService,
              dataProvider: dataProvider,
            ),
          ),
    ),
    ProxyProvider3<
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      CategoryRepository
    >(
      update:
          (_, hiveService, dataProvider, factory, _) => factory.getRepository(
            () => CategoryRepository(
              hiveService: hiveService,
              dataProvider: dataProvider,
            ),
          ),
    ),
    ProxyProvider<UserSettingsRepository, PeriodService>(
      update: (_, repo, _) => PeriodService(settingsRepository: repo),
    ),
    ProxyProvider4<
      PeriodService,
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      UpcomingRepository
    >(
      update:
          (_, periodService, hiveService, dataProvider, factory, _) =>
              factory.getRepository(
                () => UpcomingRepository(
                  periodService: periodService,
                  hiveService: hiveService,
                  dataProvider: dataProvider,
                ),
              ),
    ),
    ProxyProvider3<
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      TagRepository
    >(
      update:
          (_, hiveService, dataProvider, factory, _) => factory.getRepository(
            () => TagRepository(
              hiveService: hiveService,
              dataProvider: dataProvider,
            ),
          ),
    ),
    ProxyProvider3<
      HiveStorageProvider,
      DataProvider,
      RepositoryFactory,
      TransactionRepository
    >(
      update:
          (_, hiveService, dataProvider, factory, _) => factory.getRepository(
            () => TransactionRepository(
              hiveService: hiveService,
              dataProvider: dataProvider,
            ),
          ),
    ),
    Provider<NotificationService>(
      create: (BuildContext context) => NotificationServiceImpl(context),
    ),
    ChangeNotifierProvider<UserSettingsViewModel>(
      create:
          (BuildContext context) => UserSettingsViewModel(
            repository: Provider.of<UserSettingsRepository>(
              context,
              listen: false,
            ),
            notificationService: Provider.of<NotificationService>(
              context,
              listen: false,
            ),
          ),
    ),
  ],
  child: child,
);
