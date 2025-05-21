import 'package:hive/hive.dart';

abstract class HiveStorageProvider {
  Future<Box<T>> openBox<T>(String boxName);

  Future<void> save<T>(String boxName, String key, T value);

  Future<T?> get<T>(String boxName, String key);

  Future<List<T>> getAll<T>(String boxName);

  Future<void> delete<T>(String boxName, String key);

  Future<void> clearall<T>(String boxName);

  Future<bool> exists<T>(String boxName, String key);

  Future<bool> empty<T>(String boxName);

  Future<void> closeBox<T>(String boxName);
}
