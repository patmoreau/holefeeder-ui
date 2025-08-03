import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

class CashflowRepository
    with RepositoryInitializer
    implements BaseRepository<Cashflow> {
  final String boxName = HiveConstants.kCashflowsBoxName;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;

  CashflowRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider;

  @override
  Future<void> initialize() async {
    await _getAllFromApi();
  }

  @override
  Future<Cashflow> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Cashflow>(boxName, key) ?? Cashflow.empty;
    } catch (e) {
      _logError('getting individual cashflow', e);
      return Cashflow.empty;
    }
  }

  @override
  Future<List<Cashflow>> getAll() async {
    try {
      await ensureInitialized();
      final cashflows = await _hiveService.getAll<Cashflow>(boxName);

      if (cashflows.isNotEmpty) {
        return _sortByDate(cashflows.cast<Cashflow>().toList());
      }

      return [];
    } catch (e) {
      _logError('fetching all cashflows', e);
      return [];
    }
  }

  @override
  Future<void> save(Cashflow value) async {
    try {
      await ensureInitialized();

      // Assuming _dataProvider has a method to save cashflows
      // await _dataProvider.saveCashflow(value);

      await _hiveService.save<Cashflow>(boxName, value.id, value);

      EventBus().fire<CashflowChangedEvent>(CashflowChangedEvent(value.id));
    } catch (e) {
      _logError('saving cashflow', e);
      throw Exception('Failed to save cashflow: $e');
    }
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    try {
      await ensureInitialized();

      // Extract the key based on whether we received a string key or a Cashflow object
      final String key = keyOrValue is String ? keyOrValue : keyOrValue.id;
      final String apiId = keyOrValue is Cashflow ? keyOrValue.id : key;

      final cashflow = await _hiveService.get<Cashflow>(boxName, key);

      // For API operations, use the key as the cashflow ID
      await _dataProvider.deleteCashflow(apiId);

      // For local storage operations, use the key
      await _hiveService.delete<Cashflow>(boxName, key);

      // Fire event if we know the account ID
      if (cashflow != null && cashflow.account.id.isNotEmpty) {
        EventBus().fire<CashflowChangedEvent>(
          CashflowChangedEvent(cashflow.id),
        );
      }
    } catch (e) {
      _logError('deleting cashflow', e);
      throw Exception('Failed to delete cashflow: $e');
    }
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<Cashflow>(boxName, key);
    } catch (e) {
      _logError('checking if cashflow exists', e);
      throw Exception('Failed to check if cashflow exists: $e');
    }
  }

  @override
  Future<Cashflow> refresh(dynamic keyOrValue) async {
    try {
      final String key = keyOrValue is String ? keyOrValue : keyOrValue.id;

      // Get the cashflow from the API
      final cashflow = await _dataProvider.getCashflow(key);

      // Save to local storage
      await _hiveService.save<Cashflow>(boxName, cashflow.id, cashflow);

      return cashflow;
    } catch (e) {
      _logError('refreshing cashflow from API', e);
      return Cashflow.empty;
    }
  }

  @override
  Future<void> refreshAll() async {
    try {
      await _hiveService.clearall<Cashflow>(boxName);
      await _getAllFromApi();
    } catch (e) {
      _logError('refreshing all cashflows', e);
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
      _logError('clearing cashflow data', e);
      throw Exception('Failed to clear cashflow data: $e');
    }
  }

  Future<void> modify(ModifyCashflow item) async {
    try {
      await ensureInitialized();

      await _dataProvider.modifyCashflow(item);

      await refresh(item.id);

      EventBus().fire<CashflowChangedEvent>(CashflowChangedEvent(item.id));
    } catch (e) {
      _logError('saving cashflow', e);
      throw Exception('Failed to save cashflow: $e');
    }
  }

  List<Cashflow> _sortByDate(List<Cashflow> items) {
    items.sort((a, b) => b.effectiveDate.compareTo(a.effectiveDate));
    return items;
  }

  Future<List<Cashflow>> _getAllFromApi() async {
    try {
      final items = await _dataProvider.getCashflows();

      await _hiveService.clearall<Cashflow>(boxName);

      for (var item in items) {
        await _hiveService.save<Cashflow>(boxName, item.key, item);
      }

      return _sortByDate(items);
    } catch (e) {
      _logError('refreshing cashflows from API', e);
      return [];
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log(
      'Error when $operation',
      name: 'CashflowRepository',
      error: error,
    );
  }
}
