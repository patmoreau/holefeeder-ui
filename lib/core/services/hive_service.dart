import 'package:hive_ce_flutter/hive_flutter.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/hive/hive_registrar.g.dart';

import '../adapters/decimal_adapter.dart';

abstract class HiveService {
  Future<void> save<T>(String boxName, String key, T value);

  Future<T?> get<T>(String boxName, String key);

  Future<List<T>> getAll<T>(String boxName);

  Future<void> delete<T>(String boxName, String key);

  Future<void> clearall<T>(String boxName);

  Future<bool> exists<T>(String boxName, String key);

  Future<bool> empty<T>(String boxName);

  Future<void> dispose();
}

class HiveServiceImpl implements HiveService {
  static HiveServiceImpl? _instance;
  static bool _initialized = false;
  static Future<void>? _initializationFuture;

  HiveServiceImpl._();

  static HiveService get instance {
    _instance ??= HiveServiceImpl._();
    return _instance!;
  }

  // Keep static init for easy setup
  static Future<void> init() async {
    if (_initialized) return;

    // Prevent multiple concurrent initializations
    if (_initializationFuture != null) {
      return _initializationFuture;
    }

    _initializationFuture = _performInit();
    await _initializationFuture;
  }

  static Future<void> _performInit() async {
    await Hive.initFlutter();

    Hive
      ..registerAdapter(DecimalAdapter())
      ..registerAdapters();

    // Open boxes
    await Hive.openBox(HiveConstants.kAccountsBoxName);
    await Hive.openBox(HiveConstants.kCashflowsBoxName);
    await Hive.openBox(HiveConstants.kCategoriesBoxName);
    await Hive.openBox(HiveConstants.kPendingActionsBoxName);
    await Hive.openBox(HiveConstants.kTagBoxName);
    await Hive.openBox(HiveConstants.kTransactionsBoxName);
    await Hive.openBox(HiveConstants.kUpcomingsBoxName);
    await Hive.openBox(HiveConstants.kUserSettingsBoxName);

    _initialized = true;
  }

  Future<void> _ensureInitialized() async {
    if (!_initialized) {
      await init();
    }
  }

  @override
  Future<void> save<T>(String boxName, String key, T value) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    await box.put(key, value);
  }

  @override
  Future<T?> get<T>(String boxName, String key) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    return box.get(key) as T?;
  }

  @override
  Future<List<T>> getAll<T>(String boxName) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    if (box.isEmpty) {
      return [];
    }
    return box.values.toList().cast<T>();
  }

  @override
  Future<void> delete<T>(String boxName, String key) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    await box.delete(key);
  }

  @override
  Future<void> clearall<T>(String boxName) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    await box.clear();
  }

  @override
  Future<bool> exists<T>(String boxName, String key) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    return box.containsKey(key);
  }

  @override
  Future<bool> empty<T>(String boxName) async {
    await _ensureInitialized();
    final box = Hive.box(boxName);
    return box.isEmpty;
  }

  @override
  Future<void> dispose() async {
    if (_instance != null) {
      await Hive.close();
      _instance = null;
      _initialized = false;
      _initializationFuture = null;
    }
  }
}
