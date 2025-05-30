import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';

class UpcomingRepository
    with RepositoryInitializer
    implements BaseRepository<Upcoming> {
  final String boxName = HiveConstants.upcomingsBoxName;
  final PeriodService _periodService;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;

  UpcomingRepository({
    required PeriodService periodService,
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _periodService = periodService,
       _hiveService = hiveService,
       _dataProvider = dataProvider;

  @override
  Future<void> initialize() async {
    await _getAllFromApi();
  }

  @override
  Future<Upcoming> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Upcoming>(boxName, key) ?? Upcoming.empty;
    } catch (e) {
      developer.log('Error getting upcoming cashflow: $e');
      return Upcoming.empty;
    }
  }

  @override
  Future<void> save(String key, Upcoming value) async {
    try {
      await _dataProvider.payCashflow(
        PayCashflow(
          date: value.date,
          amount: value.amount,
          cashflowId: value.id,
          cashflowDate: value.date,
        ),
      );
      await _getAllFromApi();
      developer.log(
        'UpcomingRepository: Firing TransactionAddedEvent for accountId: ${value.account.id}',
      );
      EventBus().fire(TransactionAddedEvent(value.account.id));
    } catch (e) {
      developer.log('Error saving upcoming cashflow: $e');
      throw Exception('Failed to save upcoming cashflow');
    }
  }

  @override
  Future<void> delete(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<bool> exists(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<Upcoming> refresh(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<void> dispose() async {
    await _hiveService.closeBox<Upcoming>(HiveConstants.accountsBoxName);
  }

  Future<List<Upcoming>> getForAccount(String accountId) async {
    try {
      await ensureInitialized();
      final cashflows =
          (await _hiveService.getAll<Upcoming>(
            boxName,
          )).where((upcoming) => upcoming.account.id == accountId).toList();

      if (cashflows.isEmpty) {
        return cashflows;
      }

      final sortedCashflows = cashflows.cast<Upcoming>().toList();
      sortedCashflows.sort((a, b) => a.date.compareTo(b.date));
      return sortedCashflows;
    } catch (e) {
      developer.log('Error fetching upcoming cashflows: $e');
      return [];
    }
  }

  Future<List<Upcoming>> _getAllFromApi() async {
    try {
      final period = await _periodService.getCurrentPeriod();
      final apiAccounts = await _dataProvider.getUpcomingCashflows(
        period.start,
        period.end,
        null,
      );

      await _hiveService.clearall<Upcoming>(boxName);

      for (var account in apiAccounts) {
        await _hiveService.save<Upcoming>(boxName, account.id, account);
      }

      return apiAccounts;
    } catch (e) {
      developer.log('Error refreshing upcoming cashflows from API: $e');
      return [];
    }
  }
}
