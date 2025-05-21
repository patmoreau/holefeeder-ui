import 'package:flutter/foundation.dart';
import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/providers/hive_storage_provider.dart';

class HiveStorageProviderImpl implements HiveStorageProvider {
  @override
  Future<Box<T>> openBox<T>(String boxName) async {
    try {
      if (Hive.isBoxOpen(boxName)) {
        return Hive.box<T>(boxName);
      } else {
        return await Hive.openBox<T>(boxName);
      }
    } catch (e) {
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
      closeWhenIsWeb(box);
    }
  }

  @override
  Future<T?> get<T>(String boxName, String key) async {
    final box = await openBox<T>(boxName);
    try {
      return box.get(key);
    } finally {
      closeWhenIsWeb(box);
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
      closeWhenIsWeb(box);
    }
  }

  @override
  Future<void> delete<T>(String boxName, String key) async {
    final box = await openBox<T>(boxName);
    try {
      await box.delete(key);
    } finally {
      closeWhenIsWeb(box);
    }
  }

  @override
  Future<void> clearall<T>(String boxName) async {
    final box = await openBox<T>(boxName);
    try {
      await box.clear();
    } finally {
      closeWhenIsWeb(box);
    }
  }

  @override
  Future<bool> exists<T>(String boxName, String key) async {
    final box = await openBox<T>(boxName);
    try {
      return box.containsKey(key);
    } finally {
      closeWhenIsWeb(box);
    }
  }

  @override
  Future<bool> empty<T>(String boxName) async {
    final box = await openBox<T>(boxName);
    try {
      final result = box.isEmpty;

      return result;
    } finally {
      closeWhenIsWeb(box);
    }
  }

  @override
  Future<void> closeBox<T>(String boxName) async {
    if (Hive.isBoxOpen(boxName)) {
      final box = Hive.box<T>(boxName);
      await box.close();
    }
  }

  Future<void> closeWhenIsWeb<T>(Box<T> box) async {
    // On web, it's a good practice to close boxes after use
    if (kIsWeb && box.isOpen) {
      await box.compact();
      await box.close();
    }
  }
}
