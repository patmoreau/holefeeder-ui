import 'package:decimal/decimal.dart';
import 'package:hive_ce/hive.dart';
import 'package:holefeeder/core/models/account_info.dart';
import 'package:holefeeder/core/models/category_info.dart';
import 'package:intl/intl.dart';

import 'hive_key.dart';

class Transaction extends HiveObject with HiveKey {
  final String id;

  final DateTime date;

  final Decimal amount;

  final String description;

  final List<String> tags;

  final CategoryInfo category;

  final AccountInfo account;

  Transaction({
    required this.id,
    required this.date,
    required this.amount,
    required this.description,
    required this.tags,
    required this.category,
    required this.account,
  });

  static final Transaction empty = Transaction(
    id: '',
    date: DateTime(1970, 1, 1),
    amount: Decimal.zero,
    description: '',
    tags: [],
    category: CategoryInfo.empty,
    account: AccountInfo.empty,
  );

  @override
  String get key => createKey(id);

  static String createKey(String id) => id;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Transaction &&
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

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
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
