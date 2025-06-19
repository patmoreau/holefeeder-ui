import 'dart:async';
import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

class TagRepository with RepositoryInitializer implements BaseRepository<Tag> {
  final String boxName = HiveConstants.tagBoxName;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;
  late final StreamSubscription _transactionAddedSubscription;

  TagRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider {
    _transactionAddedSubscription = EventBus()
        .on<TransactionAddedEvent>()
        .listen(_handleTransactionAdded);
  }

  Future<void> _handleTransactionAdded(TransactionAddedEvent event) async {
    _logInfo('Handling transaction added event');
    await refreshAll();
  }

  @override
  Future<void> initialize() async {
    await _getAllFromApi();
  }

  @override
  Future<Tag> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Tag>(boxName, key) ?? Tag.empty;
    } catch (e) {
      _logError('getting individual tag', e);
      return Tag.empty;
    }
  }

  @override
  Future<List<Tag>> getAll() async {
    try {
      await ensureInitialized();
      final items = await _hiveService.getAll<Tag>(boxName);

      if (items.isNotEmpty) {
        return _sortByCount(items.cast<Tag>().toList());
      }

      return _getAllFromApi();
    } catch (e) {
      _logError('fetching all tags', e);
      return [];
    }
  }

  @override
  Future<void> save(Tag value) async {
    _logError('saving tag', 'This operation is not yet implemented');
    throw Exception(
      'The save operation for individual tag is not yet implemented',
    );
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    _logError('deleting tag', 'This operation is not yet implemented');
    throw Exception(
      'The delete operation for individual tag is not yet implemented',
    );
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<Tag>(boxName, key);
    } catch (e) {
      _logError('checking if tag exists', e);
      throw Exception('Failed to check if tag exists: $e');
    }
  }

  @override
  Future<Tag> refresh(dynamic keyOrValue) async {
    _logError('refresh operation', 'This operation is not yet implemented');
    throw Exception(
      'The refresh operation for individual tag is not yet implemented',
    );
  }

  @override
  Future<void> refreshAll() async {
    try {
      await _hiveService.clearall<Tag>(boxName);
      await _getAllFromApi();
    } catch (e) {
      _logError('refreshing all tags', e);
    }
  }

  @override
  Future<void> dispose() async {
    await _transactionAddedSubscription.cancel();
    await _hiveService.closeBox<Tag>(boxName);
  }

  @override
  Future<void> clearData() async {
    try {
      await _hiveService.resetBox<Tag>(boxName);
      await initialize();
    } catch (e) {
      _logError('clearing tag data', e);
      throw Exception('Failed to clear tag data: $e');
    }
  }

  List<Tag> _sortByCount(List<Tag> items) {
    items.sort((a, b) => b.count.compareTo(a.count));
    return items;
  }

  Future<List<Tag>> _getAllFromApi() async {
    try {
      final items = await _dataProvider.getTags();

      await _hiveService.clearall<Tag>(boxName);

      for (var item in items) {
        await _hiveService.save<Tag>(boxName, item.key, item);
      }

      return _sortByCount(items);
    } catch (e) {
      _logError('refreshing tags from API', e);
      return [];
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log('TagRepository error when $operation: $error');
  }

  void _logInfo(String operation) {
    developer.log('TagRepository: $operation');
  }
}
