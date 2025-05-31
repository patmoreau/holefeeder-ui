import 'repositories.dart';

class RepositoryFactory {
  final Map<Type, BaseRepository> _repositories = {};
  bool _isDisposed = false;

  T getRepository<T extends BaseRepository>(T Function() factory) {
    if (_isDisposed) {
      throw StateError('RepositoryService has been disposed');
    }

    final repo = _repositories.putIfAbsent(T, factory);
    return repo as T;
  }

  bool hasRepository<T extends BaseRepository>() {
    return _repositories.containsKey(T);
  }

  Future<void> dispose() async {
    if (_isDisposed) return;

    for (final repository in _repositories.values) {
      await repository.dispose();
    }
    _repositories.clear();
    _isDisposed = true;
  }
}
