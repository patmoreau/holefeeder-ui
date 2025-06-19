import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

class CategoryRepository
    with RepositoryInitializer
    implements BaseRepository<Category> {
  final String boxName = HiveConstants.categoriesBoxName;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;

  CategoryRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider;

  @override
  Future<void> initialize() async {
    await _getAllFromApi();
  }

  @override
  Future<Category> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Category>(boxName, key) ?? Category.empty;
    } catch (e) {
      _logError('getting individual category', e);
      return Category.empty;
    }
  }

  @override
  Future<List<Category>> getAll() async {
    try {
      await ensureInitialized();
      final items = await _hiveService.getAll<Category>(boxName);

      if (items.isNotEmpty) {
        return _sort(items.cast<Category>().toList());
      }

      return await _getAllFromApi();
    } catch (e) {
      _logError('fetching categories', e);
      return [];
    }
  }

  @override
  Future<void> save(Category value) async {
    try {
      await ensureInitialized();
      // Assuming _dataProvider has a method to save categories
      // await _dataProvider.saveCategory(value);
      await _hiveService.save<Category>(boxName, value.key, value);
      // EventBus().fire<CategoryRefreshedEvent>(
      //   CategoryRefreshedEvent(value.key, value),
      // );
    } catch (e) {
      _logError('saving category', e);
      throw Exception('Failed to save category: $e');
    }
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    try {
      await ensureInitialized();

      final String key = keyOrValue is String ? keyOrValue : keyOrValue.key;
      // final String apiId = keyOrValue is Category ? keyOrValue.id : key;

      // For API operations, use the API ID
      // await _dataProvider.deleteCategory(apiId);

      await _hiveService.delete<Category>(boxName, key);

      // Fire event with the key that was deleted
      //EventBus().fire<CategoryDeletedEvent>(CategoryDeletedEvent(key));
    } catch (e) {
      _logError('deleting category', e);
      throw Exception('Failed to delete category: $e');
    }
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<Category>(boxName, key);
    } catch (e) {
      _logError('checking if category exists', e);
      throw Exception('Failed to check if category exists: $e');
    }
  }

  @override
  Future<Category> refresh(dynamic keyOrValue) async {
    try {
      // Extract the key and API ID as needed
      final String key = keyOrValue is String ? keyOrValue : keyOrValue.key;
      final String apiId = keyOrValue is Category ? keyOrValue.id : key;

      // Use the API ID for API operations
      final category = await _dataProvider.getCategory(apiId);

      // Use the key for local storage
      await _hiveService.save<Category>(boxName, category.key, category);
      return category;
    } catch (e) {
      _logError('refreshing category from API', e);
      return Category.empty;
    }
  }

  @override
  Future<void> refreshAll() async {
    try {
      await _hiveService.clearall<Category>(boxName);
      await _getAllFromApi();
    } catch (e) {
      _logError('refreshing all categories', e);
    }
  }

  @override
  Future<void> dispose() async {
    await _hiveService.closeBox<Category>(boxName);
  }

  @override
  Future<void> clearData() async {
    try {
      await _hiveService.resetBox<Category>(boxName);
      await initialize();
    } catch (e) {
      _logError('clearing category data', e);
      throw Exception('Failed to clear category data: $e');
    }
  }

  List<Category> _sort(List<Category> items) {
    items.sort((a, b) {
      if (a.favorite != b.favorite) {
        return b.favorite ? 1 : -1;
      }
      return a.name.compareTo(b.name);
    });
    return items;
  }

  Future<List<Category>> _getFilteredAccounts(
    bool Function(Category) predicate,
  ) async {
    final allCategories = await getAll();
    return allCategories.where(predicate).toList();
  }

  Future<List<Category>> getFavoriteCategories() async {
    return _getFilteredAccounts((category) => category.favorite);
  }

  Future<List<Category>> _getAllFromApi() async {
    try {
      final items = await _dataProvider.getCategories();

      await _hiveService.clearall<Category>(boxName);

      for (var item in items) {
        await _hiveService.save<Category>(boxName, item.key, item);
      }

      return _sort(items);
    } catch (e) {
      _logError('refreshing categories from API', e);
      return [];
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log(
      'Error when $operation',
      name: 'CategoryRepository',
      error: error,
    );
  }
}
