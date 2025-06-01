import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/constants.dart';

import 'hive_key.dart';

part 'tag.g.dart';

@HiveType(typeId: HiveConstants.tagTypeId)
class Tag with HiveKey {
  @HiveField(0)
  final String tag;
  @HiveField(1)
  final int count;

  const Tag({required this.tag, required this.count});

  static const empty = Tag(tag: '', count: 0);

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
