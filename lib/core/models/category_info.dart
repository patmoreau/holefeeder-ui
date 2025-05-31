import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/enums/category_type_enum.dart';

part 'category_info.g.dart';

@HiveType(typeId: HiveConstants.categoryInfoTypeId)
class CategoryInfo {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final CategoryType type;

  @HiveField(3)
  final String color;

  const CategoryInfo({
    required this.id,
    required this.name,
    required this.type,
    required this.color,
  });

  static final CategoryInfo empty = CategoryInfo(
    id: '',
    name: '',
    type: CategoryType.expense,
    color: '',
  );

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategoryInfo &&
          id == other.id &&
          name == other.name &&
          type == other.type &&
          color == other.color;

  @override
  int get hashCode =>
      id.hashCode ^ name.hashCode ^ type.hashCode ^ color.hashCode;

  factory CategoryInfo.fromJson(Map<String, dynamic> json) {
    return CategoryInfo(
      id: json['id'] as String,
      name: json['name'] as String,
      type: CategoryTypeExtension.fromString(json['type'] as String),
      color: json['color'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.toStringValue(),
      'color': color,
    };
  }
}
