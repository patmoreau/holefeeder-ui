import 'package:decimal/decimal.dart';
import 'package:hive_ce/hive.dart';
import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/models/account_info.dart';
import 'package:holefeeder/core/models/category_info.dart';
import 'package:intl/intl.dart';

import 'hive_key.dart';

class Cashflow extends HiveObject with HiveKey {
  final String id;

  final DateTime effectiveDate;

  final Decimal amount;

  final DateIntervalType intervalType;

  final int frequency;

  final int recurrence;

  final String description;

  final bool inactive;

  final List<String> tags;

  final CategoryInfo category;

  final AccountInfo account;

  Cashflow({
    required this.id,
    required this.effectiveDate,
    required this.amount,
    required this.intervalType,
    required this.frequency,
    required this.recurrence,
    required this.description,
    this.inactive = false,
    required this.tags,
    required this.category,
    required this.account,
  });

  static final Cashflow empty = Cashflow(
    id: '',
    effectiveDate: DateTime(1970, 1, 1),
    amount: Decimal.zero,
    intervalType: DateIntervalType.monthly,
    frequency: 0,
    recurrence: 0,
    inactive: false,
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
      other is Cashflow &&
          id == other.id &&
          effectiveDate.isAtSameMomentAs(other.effectiveDate) &&
          amount == other.amount &&
          intervalType == other.intervalType &&
          frequency == other.frequency &&
          recurrence == other.recurrence &&
          inactive == other.inactive &&
          description == other.description &&
          tags == other.tags &&
          category == other.category &&
          account == other.account;

  @override
  int get hashCode =>
      id.hashCode ^
      effectiveDate.hashCode ^
      amount.hashCode ^
      intervalType.hashCode ^
      frequency.hashCode ^
      recurrence.hashCode ^
      inactive.hashCode ^
      description.hashCode ^
      tags.hashCode ^
      category.hashCode ^
      account.hashCode;

  factory Cashflow.fromJson(Map<String, dynamic> json) {
    return Cashflow(
      id: json['id'] as String,
      effectiveDate: DateTime.parse(json['effectiveDate'] as String),
      intervalType: DateIntervalTypeExtension.fromString(
        json['intervalType'] as String,
      ),
      frequency: json['frequency'] as int,
      recurrence: json['recurrence'] as int,
      inactive: json['inactive'] as bool? ?? false,
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
      'effectiveDate': DateFormat('yyyy-MM-dd').format(effectiveDate),
      'intervalType': intervalType.toStringValue(),
      'frequency': frequency,
      'recurrence': recurrence,
      'inactive': inactive,
      'amount': double.parse(amount.toString()),
      'description': description,
      'tags': tags,
      'category': category.toJson(),
      'account': account.toJson(),
    };
  }
}
