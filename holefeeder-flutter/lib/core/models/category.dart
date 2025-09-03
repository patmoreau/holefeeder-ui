import 'package:decimal/decimal.dart';
import 'package:hive_ce/hive.dart';

import 'hive_key.dart';

class Category extends HiveObject with HiveKey {
  final String id;

  final String name;

  final String color;

  final Decimal budgetAmount;

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

  Category({
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
