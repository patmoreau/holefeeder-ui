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
