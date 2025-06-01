import 'package:decimal/decimal.dart';
import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/constants.dart';

import 'hive_key.dart';

part 'category.g.dart';

@HiveType(typeId: HiveConstants.categoryTypeId)
class Category with HiveKey {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String color;

  @HiveField(3)
  final Decimal budgetAmount;

  @HiveField(4)
  final bool favorite;

  static final Category empty = Category(
    id: '',
    name: '',
    color: '',
    budgetAmount: Decimal.zero,
    favorite: false,
  );

  @override
  String get key => createKey(id);

  static String createKey(String id) => id;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Category &&
          other.id == id &&
          other.name == name &&
          other.color == color &&
          other.budgetAmount == budgetAmount &&
          other.favorite == favorite);

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      color.hashCode ^
      budgetAmount.hashCode ^
      favorite.hashCode;

  const Category({
    required this.id,
    required this.name,
    required this.color,
    required this.budgetAmount,
    required this.favorite,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      color: json['color'] as String,
      budgetAmount: Decimal.parse(json['budgetAmount'].toString()),
      favorite: json['favorite'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'color': color,
      'budgetAmount': budgetAmount.toString(),
      'favorite': favorite,
    };
  }
}
