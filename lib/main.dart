import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:holefeeder/core/adapters/adapters.dart';
import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/router.dart';
import 'package:holefeeder/ui/services/notification_service.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:provider/single_child_widget.dart';
import 'package:universal_platform/universal_platform.dart';

import 'holefeeder_app.dart';

const appScheme = 'https';

// Global variable to indicate quick action launch
bool launchedFromQuickAction = false;

Future<void> main() async {
  await dotenv.load(
    fileName: 'assets/env/.env.${kReleaseMode ? "production" : "development"}',
  );
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive
  await _initHive();

  final authenticationService = _createAuthenticationService();
  await authenticationService.init();

  // Check authentication status before proceeding
  final authStatus = await authenticationService.statusStream.first;

  // Create MaterialApp with providers
  runApp(
    MultiProvider(
      providers: <SingleChildWidget>[
        Provider<AuthenticationClient>(
          create: (BuildContext context) => authenticationService,
        ),
        Provider<EventBus>(create: (BuildContext context) => EventBus()),
        Provider<RestClient>(
          create:
              (BuildContext context) =>
                  RestClient(_createDio(context), baseUrl: kServerUrl),
        ),
        Provider<DataProvider>(
          create:
              (BuildContext context) => DataProviderImpl(
                Provider.of<RestClient>(context, listen: false),
              ),
        ),
        Provider<HiveStorageProvider>(
          create: (BuildContext context) => HiveStorageProviderImpl(),
          lazy: false,
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
              (_, hiveService, dataProvider, factory, _) =>
                  factory.getRepository(
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
          AccountRepository
        >(
          update:
              (_, hiveService, dataProvider, factory, _) =>
                  factory.getRepository(
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
              (_, hiveService, dataProvider, factory, _) =>
                  factory.getRepository(
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
              (_, hiveService, dataProvider, factory, _) =>
                  factory.getRepository(
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
              (_, hiveService, dataProvider, factory, _) =>
                  factory.getRepository(
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
      child: const HolefeederApp(),
    ),
  );

  // Handle navigation based on authentication status
  if (launchedFromQuickAction) {
    if (authStatus == AuthenticationStatus.authenticated) {
      router.go('/purchase');
    } else {
      router.go('/login', extra: '/purchase');
    }
  } else if (authStatus == AuthenticationStatus.unauthenticated) {
    router.go('/login');
  }
}

Future<void> _initHive() async {
  // Initialize Hive
  await Hive.initFlutter();

  // Register adapters
  Hive.registerAdapter(AccountAdapter());
  Hive.registerAdapter(AccountInfoAdapter());
  Hive.registerAdapter(AccountTypeAdapter());
  Hive.registerAdapter(CategoryAdapter());
  Hive.registerAdapter(CategoryInfoAdapter());
  Hive.registerAdapter(CategoryTypeAdapter());
  Hive.registerAdapter(DateIntervalTypeAdapter());
  Hive.registerAdapter(DecimalAdapter());
  Hive.registerAdapter(UpcomingAdapter());
  Hive.registerAdapter(UserSettingsAdapter());
  Hive.registerAdapter(TagAdapter());
  Hive.registerAdapter(TransactionAdapter());
}

AuthenticationClient _createAuthenticationService() =>
    UniversalPlatform.isWeb
        ? WebAuthenticationClient()
        : MobileAuthenticationClient();

Dio _createDio(BuildContext context) {
  final dio = Dio();
  final df = DateFormat('yyyy-MM-dd');

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final authenticationClient = context.read<AuthenticationClient>();

        if (await authenticationClient.isTokenExpired()) {
          await authenticationClient.refreshToken();
        }
        final status = await authenticationClient.statusStream.first;
        if (status == AuthenticationStatus.authenticated) {
          final token = authenticationClient.credentials.accessToken;
          options.headers['Authorization'] = 'Bearer $token';
        }

        return handler.next(options);
      },
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        options.queryParameters = {
          for (var e in options.queryParameters.entries)
            e.key:
                DateTime.tryParse(e.value.toString()) != null
                    ? df.format(DateTime.parse(e.value.toString()))
                    : e.value,
        };
        return handler.next(options);
      },
    ),
  );

  return dio;
}
