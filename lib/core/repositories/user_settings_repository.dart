import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/models/user_settings.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/providers/hive_storage_provider.dart';
import 'package:holefeeder/core/repositories/base_repository.dart';

class UserSettingsRepository
    with RepositoryInitializer
    implements BaseRepository<UserSettings> {
  final String boxName = HiveConstants.kUserSettingsBoxName;
  final String key = HiveConstants.kUserSettingsKey;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;

  UserSettingsRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider;

  @override
  Future<void> initialize() async {
    await _getFromApi();
  }

  @override
  Future<UserSettings> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<UserSettings>(boxName, key) ??
          UserSettings.empty;
    } catch (e) {
      _logError('getting user settings', e);
      return UserSettings.empty;
    }
  }

  @override
  Future<List<UserSettings>> getAll() async {
    try {
      await ensureInitialized();
      final settings = await get(key);
      // UserSettings is a singleton, so we wrap it in a list
      return [settings];
    } catch (e) {
      _logError('getting all user settings', e);
      return [];
    }
  }

  @override
  Future<void> save(UserSettings value) async {
    try {
      await ensureInitialized();

      // Save locally
      await _hiveService.save<UserSettings>(boxName, value.key, value);

      // Also save to API
      try {
        await _dataProvider.saveUserSettings(value);
      } catch (e) {
        _logError('saving user settings to API', e);
        // Consider implementing a job queue for failed API operations
        // that can be retried when connectivity is restored
      }
    } catch (e) {
      _logError('saving user settings', e);
      throw Exception('Failed to save user settings: $e');
    }
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    // Preserve as unimplemented but with improved error message
    _logError('delete operation', 'Operation not applicable for user settings');
    throw Exception('The delete operation is not applicable for user settings');
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<UserSettings>(boxName, key);
    } catch (e) {
      _logError('checking if user settings exists', e);
      throw Exception('Failed to check if user settings exists: $e');
    }
  }

  @override
  Future<UserSettings> refresh(dynamic keyOrValue) async {
    try {
      // For user settings, we just need to refresh from API
      return await _getFromApi();
    } catch (e) {
      _logError('refreshing user settings from API', e);
      return UserSettings.empty;
    }
  }

  @override
  Future<void> refreshAll() async {
    try {
      await _getFromApi();
    } catch (e) {
      _logError('refreshing all user settings', e);
      throw Exception('Failed to refresh user settings: $e');
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
      _logError('clearing user settings data', e);
      throw Exception('Failed to clear user settings data: $e');
    }
  }

  Future<UserSettings> getDefault() async {
    try {
      await ensureInitialized();
      return await get(key);
    } catch (e) {
      _logError('getting default user settings', e);
      return UserSettings.empty;
    }
  }

  Future<UserSettings> _getFromApi() async {
    try {
      final apiData = await _dataProvider.getUserSettings();

      await _hiveService.clearall<UserSettings>(boxName);
      await _hiveService.save<UserSettings>(boxName, key, apiData);

      return apiData;
    } catch (e) {
      _logError('fetching user settings from API', e);
      return UserSettings.empty;
    }
  }

  /// Consistent logging approach for the repository
  void _logError(String operation, dynamic error) {
    developer.log(
      'Error when $operation',
      name: 'UserSettingsRepository',
      error: error,
    );
  }
}
