import 'dart:async';

import 'package:holefeeder/core/models/hive_key.dart';

mixin RepositoryInitializer {
  bool _isInitialized = false;
  Completer<void>? _initializationCompleter;

  Future<void> ensureInitialized() async {
    if (_isInitialized) return;

    // If initialization is already in progress, wait for it to complete
    if (_initializationCompleter != null) {
      await _initializationCompleter!.future;
      return;
    }

    // Create a new completer for this initialization attempt
    _initializationCompleter = Completer<void>();

    try {
      await initialize();
      _isInitialized = true;
      _initializationCompleter!.complete();
    } catch (e) {
      _initializationCompleter!.completeError(e);
      _initializationCompleter = null;
      rethrow;
    }
  }

  Future<void> initialize();
}

abstract class BaseRepository<T extends HiveKey> with RepositoryInitializer {
  Future<T> get(String key);

  Future<List<T>> getAll();

  Future<void> save(T value);

  Future<void> delete(dynamic keyOrValue);

  Future<bool> exists(String key);

  Future<T> refresh(dynamic keyOrValue);

  Future<void> refreshAll();

  Future<void> dispose();

  Future<void> clearData();
}
