import 'package:hive_ce/hive.dart';

import 'hive_key.dart';

class Tag extends HiveObject with HiveKey {
  final String tag;
  final int count;

  Tag({required this.tag, required this.count});

  static final empty = Tag(tag: '', count: 0);

  @override
  String get key => createKey(tag);

  static String createKey(String id) => id;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Tag && tag == other.tag && count == other.count);

  @override
  int get hashCode => tag.hashCode ^ count.hashCode;

  factory Tag.fromJson(Map<String, dynamic> json) {
    return Tag(tag: json['tag'] as String, count: json['count'] as int);
  }

  Map<String, dynamic> toJson() {
    return {'tag': tag, 'count': count};
  }
}
