import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/models/user_settings.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/providers/hive_storage_provider.dart';
import 'package:holefeeder/core/repositories/base_repository.dart';

class UserSettingsRepository
    with RepositoryInitializer
    implements BaseRepository<UserSettings> {
  final String boxName = HiveConstants.userSettingsBoxName;
  final String key = HiveConstants.userSettingsKey;
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
    await ensureInitialized();

    return await _hiveService.get<UserSettings>(boxName, key) ??
        UserSettings.empty;
  }

  @override
  Future<void> save(UserSettings value) async {
    // Save locally
    await _hiveService.save<UserSettings>(
      HiveConstants.userSettingsBoxName,
      value.key,
      value,
    );

    // Also save to API
    try {
      await _dataProvider.saveUserSettings(value);
    } catch (e) {
      developer.log('Error saving user settings to API: $e');
      // Consider implementing a job queue for failed API operations
      // that can be retried when connectivity is restored
    }
  }

  @override
  Future<void> delete(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<bool> exists(String key) async {
    return await _hiveService.exists<UserSettings>(
      HiveConstants.userSettingsBoxName,
      key,
    );
  }

  @override
  Future<UserSettings> refresh(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<UserSettings> refreshAll() async {
    throw Exception('Not implemented');
  }

  @override
  Future<void> dispose() async {
    await _hiveService.closeBox<UserSettings>(boxName);
  }

  Future<UserSettings> getDefault() async {
    await ensureInitialized();
    return await get(key);
  }

  Future<UserSettings> _getFromApi() async {
    try {
      final apiData = await _dataProvider.getUserSettings();

      await _hiveService.clearall<UserSettings>(boxName);
      await _hiveService.save<UserSettings>(boxName, key, apiData);

      return apiData;
    } catch (e) {
      developer.log('Error refreshing accounts from API: $e');
      return UserSettings.empty;
    }
  }
}
