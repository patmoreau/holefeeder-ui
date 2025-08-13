import 'dart:developer' as developer;

import 'package:holefeeder/core/constants.dart';
import 'package:holefeeder/core/events.dart';
import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/services.dart';

import 'base_repository.dart';

abstract class UpcomingRepository extends BaseRepository<Upcoming> {
  Future<List<Upcoming>> getForAccount(String accountId);
}

class UpcomingRepositoryImpl
    with RepositoryInitializer
    implements UpcomingRepository {
  final String boxName = HiveConstants.kUpcomingsBoxName;
  final PeriodService _periodService;
  final HiveService _hiveService;
  final ApiService _dataProvider;

  UpcomingRepositoryImpl({
    required PeriodService periodService,
    required HiveService hiveService,
    required ApiService dataProvider,
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
      _logError('getting individual upcoming', e);
      return Upcoming.empty;
    }
  }

  @override
  Future<List<Upcoming>> getAll() async {
    try {
      await ensureInitialized();
      final upcomings = await _hiveService.getAll<Upcoming>(boxName);

      if (upcomings.isNotEmpty) {
        return _sortByDate(upcomings.cast<Upcoming>().toList());
      }

      return await _getAllFromApi();
    } catch (e) {
      _logError('fetching all upcomings', e);
      return [];
    }
  }

  @override
  Future<void> save(Upcoming value) async {
    try {
      await ensureInitialized();
      await _dataProvider.payCashflow(
        PayCashflow(
          date: value.date,
          amount: value.amount,
          cashflowId: value.id,
          cashflowDate: value.date,
        ),
      );
      await _getAllFromApi();

      _logInfo(
        'Firing TransactionAddedEvent for accountId: ${value.account.id}',
      );
      EventBus().fire(TransactionAddedEvent(value.account.id));
    } catch (e) {
      _logError('saving upcoming cashflow', e);
      throw Exception('Failed to save upcoming cashflow: $e');
    }
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    _logError('delete operation', 'This operation is not yet implemented');
    throw Exception(
      'The delete operation for upcoming cashflows is not yet implemented',
    );
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<Upcoming>(boxName, key);
    } catch (e) {
      _logError('checking if upcoming exists', e);
      throw Exception('Failed to check if upcoming exists: $e');
    }
  }

  @override
  Future<Upcoming> refresh(dynamic keyOrValue) async {
    // Preserve as unimplemented but with improved error message
    _logError('refresh operation', 'This operation is not yet implemented');
    throw Exception(
      'The refresh operation for individual upcoming cashflows is not yet implemented',
    );
  }

  @override
  Future<void> refreshAll() async {
    try {
      await _hiveService.clearall<Upcoming>(boxName);
      await _getAllFromApi();
    } catch (e) {
      _logError('refreshing all upcomings', e);
      throw Exception('Failed to refresh all upcoming cashflows: $e');
    }
  }

  @override
  Future<void> dispose() async {}

  @override
  Future<void> clearData() async {
    try {
      await _hiveService.clearall(boxName);
      await initialize();
    } catch (e) {
      _logError('clearing upcoming data', e);
      throw Exception('Failed to clear upcoming data: $e');
    }
  }

  @override
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

      return _sortByDate(cashflows.cast<Upcoming>().toList());
    } catch (e) {
      _logError('fetching upcoming cashflows for account', e);
      return [];
    }
  }

  List<Upcoming> _sortByDate(List<Upcoming> items) {
    items.sort((a, b) => a.date.compareTo(b.date));
    return items;
  }

  Future<List<Upcoming>> _getAllFromApi() async {
    try {
      final period = await _periodService.getCurrentPeriod();
      final items = await _dataProvider.getUpcomingCashflows(
        period.start,
        period.end,
        null,
      );

      await _hiveService.clearall<Upcoming>(boxName);

      for (var item in items) {
        await _hiveService.save<Upcoming>(boxName, item.key, item);
      }

      return _sortByDate(items);
    } catch (e) {
      _logError('refreshing upcoming cashflows from API', e);
      return [];
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log(
      'Error when $operation',
      name: 'UpcomingRepository',
      error: error,
    );
  }

  void _logInfo(String message) {
    developer.log(message, name: 'UpcomingRepository');
  }
}
