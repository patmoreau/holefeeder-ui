import 'dart:async' as async;
import 'dart:developer' as developer;

import 'package:flutter/foundation.dart';
import 'package:hive_ce/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/providers/hive_storage_provider.dart';

class HiveStorageProviderImpl implements HiveStorageProvider {
  // Map to track box usage timeouts
  final Map<String, async.Timer> _boxTimers = {};

  // Web box closure delay (milliseconds)
  final int _webBoxCloseDelay =
      5000; // 5 seconds delay before closing boxes on web

  @override
  Future<Box<T>> openBox<T>(String boxName) async {
    try {
      developer.log(
        'HiveStorageProviderImpl: Opening box $boxName',
        name: 'HiveStorageProviderImpl',
      );
      if (Hive.isBoxOpen(boxName)) {
        // If there's a pending close timer for this box, cancel it
        _cancelBoxCloseTimer(boxName);
        return Hive.box<T>(boxName);
      } else {
        return await Hive.openBox<T>(boxName);
      }
    } catch (e) {
      developer.log(
        'HiveStorageProviderImpl: Error opening box $boxName: $e',
        name: 'HiveStorageProviderImpl',
        error: e,
      );
      // Handle platform-specific errors
      if (kIsWeb) {
        // On web, we might need to clear the box if it's corrupted
        await Hive.deleteBoxFromDisk(boxName);
        return await Hive.openBox<T>(boxName);
      } else {
        // Re-throw for non-web platforms
        rethrow;
      }
    }
  }

  @override
  Future<void> save<T>(String boxName, String key, T value) async {
    final box = await openBox<T>(boxName);
    try {
      await box.put(key, value);

      if (kIsWeb &&
          box.length * 100 > HiveConstants.webCompactionSizeThreshold) {
        await box.compact();
      }
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<T?> get<T>(String boxName, String key) async {
    final box = await openBox<T>(boxName);
    try {
      return box.get(key);
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<List<T>> getAll<T>(String boxName) async {
    final box = await openBox<T>(boxName);
    try {
      if (box.isEmpty) {
        return [];
      }
      return box.values.toList();
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<void> delete<T>(String boxName, String key) async {
    final box = await openBox<T>(boxName);
    try {
      await box.delete(key);
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<void> clearall<T>(String boxName) async {
    final box = await openBox<T>(boxName);
    try {
      await box.clear();
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<bool> exists<T>(String boxName, String key) async {
    final box = await openBox<T>(boxName);
    try {
      return box.containsKey(key);
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<bool> empty<T>(String boxName) async {
    final box = await openBox<T>(boxName);
    try {
      final result = box.isEmpty;

      return result;
    } finally {
      scheduleBoxClose(box);
    }
  }

  @override
  Future<void> closeBox<T>(String boxName) async {
    developer.log(
      'HiveStorageProviderImpl: Closing box $boxName',
      name: 'HiveStorageProviderImpl',
    );
    _cancelBoxCloseTimer(boxName);
    if (Hive.isBoxOpen(boxName)) {
      final box = Hive.box<T>(boxName);
      await box.close();
    }
  }

  // Schedule box closure with a delay on web platform
  void scheduleBoxClose<T>(Box<T> box) {
    if (!kIsWeb) return;

    final boxName = box.name;
    _cancelBoxCloseTimer(boxName);

    _boxTimers[boxName] = async.Timer(
      Duration(milliseconds: _webBoxCloseDelay),
      () async {
        if (Hive.isBoxOpen(boxName)) {
          developer.log(
            'HiveStorageProviderImpl: Closing box $boxName after delay',
            name: 'HiveStorageProviderImpl',
          );
          try {
            // Use the correct box type by using a dynamic approach
            // This avoids type casting errors
            await box.compact();
            await box.close();
          } catch (e) {
            developer.log(
              'HiveStorageProviderImpl: Error closing box $boxName: $e',
              name: 'HiveStorageProviderImpl',
              error: e,
            );
          }
        }
        _boxTimers.remove(boxName);
      },
    );
  }

  // Cancel any pending box close timer
  void _cancelBoxCloseTimer(String boxName) {
    if (_boxTimers.containsKey(boxName)) {
      _boxTimers[boxName]?.cancel();
      _boxTimers.remove(boxName);
    }
  }

  // This method is kept for backward compatibility but uses the new scheduling mechanism
  Future<void> closeWhenIsWeb<T>(Box<T> box) async {
    scheduleBoxClose(box);
  }
}
