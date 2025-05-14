import 'package:holefeeder/core/enums/category_type_enum.dart';

class CategoryInfo {
  final String id;
  final String name;
  final CategoryType type;
  final String color;

  const CategoryInfo({
    required this.id,
    required this.name,
    required this.type,
    required this.color,
  });

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
