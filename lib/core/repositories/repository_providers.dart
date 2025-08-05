import 'package:holefeeder/core/events/event_bus.dart';
import 'package:provider/provider.dart';

import '../services/services.dart';
import 'account_repository.dart';
import 'cashflow_repository.dart';
import 'category_repository.dart';
import 'repository_factory.dart';
import 'tag_repository.dart';
import 'transaction_repository.dart';
import 'upcoming_repository.dart';
import 'user_settings_repository.dart';

final repositoryProviders = [
  Provider<RepositoryFactory>(
    create: (context) => RepositoryFactory(),
    dispose: (_, factory) => factory.dispose(),
  ),
  ProxyProvider4<
    EventBus,
    HiveService,
    ApiService,
    RepositoryFactory,
    UserSettingsRepository
  >(
    update:
        (_, eventBus, hiveService, dataProvider, factory, _) =>
            factory.getRepository(
              () => UserSettingsRepositoryImpl(
                eventBus: eventBus,
                hiveService: hiveService,
                dataProvider: dataProvider,
              ),
            ),
  ),
  ProxyProvider3<
    HiveService,
    ApiService,
    RepositoryFactory,
    CashflowRepository
  >(
    update:
        (_, hiveService, dataProvider, factory, _) => factory.getRepository(
          () => CashflowRepositoryImpl(
            hiveService: hiveService,
            dataProvider: dataProvider,
          ),
        ),
  ),
  ProxyProvider3<HiveService, ApiService, RepositoryFactory, AccountRepository>(
    update:
        (_, hiveService, dataProvider, factory, _) => factory.getRepository(
          () => AccountRepositoryImpl(
            hiveService: hiveService,
            dataProvider: dataProvider,
          ),
        ),
  ),
  ProxyProvider3<
    HiveService,
    ApiService,
    RepositoryFactory,
    CategoryRepository
  >(
    update:
        (_, hiveService, dataProvider, factory, _) => factory.getRepository(
          () => CategoryRepositoryImpl(
            hiveService: hiveService,
            dataProvider: dataProvider,
          ),
        ),
  ),
  ProxyProvider4<
    PeriodService,
    HiveService,
    ApiService,
    RepositoryFactory,
    UpcomingRepository
  >(
    update:
        (_, periodService, hiveService, dataProvider, factory, _) =>
            factory.getRepository(
              () => UpcomingRepositoryImpl(
                periodService: periodService,
                hiveService: hiveService,
                dataProvider: dataProvider,
              ),
            ),
  ),
  ProxyProvider3<HiveService, ApiService, RepositoryFactory, TagRepository>(
    update:
        (_, hiveService, dataProvider, factory, _) => factory.getRepository(
          () => TagRepositoryImpl(
            hiveService: hiveService,
            dataProvider: dataProvider,
          ),
        ),
  ),
  ProxyProvider3<
    HiveService,
    ApiService,
    RepositoryFactory,
    TransactionRepository
  >(
    update:
        (_, hiveService, dataProvider, factory, _) => factory.getRepository(
          () => TransactionRepositoryImpl(
            hiveService: hiveService,
            dataProvider: dataProvider,
          ),
        ),
  ),
];
