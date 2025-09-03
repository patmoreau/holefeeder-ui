mixin HiveKey {
  String get key;

  static String createKey(dynamic id) {
    throw UnimplementedError('Subclasses must implement createKey');
  }
}
