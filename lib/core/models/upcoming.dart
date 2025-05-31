import 'package:decimal/decimal.dart';
import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/models/account_info.dart';
import 'package:holefeeder/core/models/category_info.dart';
import 'package:intl/intl.dart';

import 'hive_key.dart';

part 'upcoming.g.dart';

@HiveType(typeId: HiveConstants.upcomingTypeId)
class Upcoming with HiveKey {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final DateTime date;

  @HiveField(2)
  final Decimal amount;

  @HiveField(3)
  final String description;

  @HiveField(4)
  final List<String> tags;

  @HiveField(5)
  final CategoryInfo category;

  @HiveField(6)
  final AccountInfo account;

  const Upcoming({
    required this.id,
    required this.date,
    required this.amount,
    required this.description,
    required this.tags,
    required this.category,
    required this.account,
  });

  static final Upcoming empty = Upcoming(
    id: '',
    date: DateTime(1970, 1, 1),
    amount: Decimal.zero,
    description: '',
    tags: [],
    category: CategoryInfo.empty,
    account: AccountInfo.empty,
  );

  @override
  String get key => createKey(id, date);

  static String createKey(String id, DateTime date) => '$id-$date';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Upcoming &&
          id == other.id &&
          date.isAtSameMomentAs(other.date) &&
          amount == other.amount &&
          description == other.description &&
          tags == other.tags &&
          category == other.category &&
          account == other.account;

  @override
  int get hashCode =>
      id.hashCode ^
      date.hashCode ^
      amount.hashCode ^
      description.hashCode ^
      tags.hashCode ^
      category.hashCode ^
      account.hashCode;

  factory Upcoming.fromJson(Map<String, dynamic> json) {
    return Upcoming(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      amount: Decimal.parse(json['amount'].toString()),
      description: json['description'] as String,
      tags:
          (json['tags'] as List<dynamic>).map((tag) => tag as String).toList(),
      category: CategoryInfo.fromJson(json['category'] as Map<String, dynamic>),
      account: AccountInfo.fromJson(json['account'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': DateFormat('yyyy-MM-dd').format(date),
      'amount': double.parse(amount.toString()),
      'description': description,
      'tags': tags,
      'category': category.toJson(),
      'account': account.toJson(),
    };
  }
}
