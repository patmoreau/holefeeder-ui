import 'package:decimal/decimal.dart';
import 'package:hive_ce_flutter/hive_flutter.dart';
import 'package:holefeeder/core/enums.dart';

import 'hive_key.dart';

class Account extends HiveObject with HiveKey {
  final String id;

  final String name;

  final AccountType type;

  final Decimal openBalance;

  final DateTime openDate;

  final int transactionCount;

  final Decimal balance;

  final DateTime updated;

  final String description;

  final bool favorite;

  final bool inactive;

  Account({
    required this.id,
    required this.name,
    required this.type,
    required this.openBalance,
    required this.openDate,
    required this.transactionCount,
    required this.balance,
    required this.updated,
    required this.description,
    required this.favorite,
    required this.inactive,
  });

  static final Account empty = Account(
    id: '',
    name: '',
    type: AccountType.checking,
    openBalance: Decimal.zero,
    openDate: DateTime(1970, 1, 1),
    transactionCount: 0,
    balance: Decimal.zero,
    updated: DateTime(1970, 1, 1),
    description: '',
    favorite: false,
    inactive: false,
  );

  @override
  String get key => createKey(id);

  static String createKey(String id) => id;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Account &&
          id == other.id &&
          name == other.name &&
          type == other.type &&
          openBalance == other.openBalance &&
          openDate.isAtSameMomentAs(other.openDate) &&
          transactionCount == other.transactionCount &&
          balance == other.balance &&
          updated.isAtSameMomentAs(other.updated) &&
          description == other.description &&
          favorite == other.favorite &&
          inactive == other.inactive);

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      type.hashCode ^
      openBalance.hashCode ^
      openDate.hashCode ^
      transactionCount.hashCode ^
      balance.hashCode ^
      updated.hashCode ^
      description.hashCode ^
      favorite.hashCode ^
      inactive.hashCode;

  factory Account.fromJson(Map<String, dynamic> json) {
    final openBalance = Decimal.parse(json['openBalance'].toString());
    final balance = Decimal.parse(json['balance'].toString());

    return Account(
      id: json['id'] as String,
      name: json['name'] as String,
      type: AccountTypeExtension.fromString(json['type'] as String),
      openBalance: openBalance,
      openDate: DateTime.parse(json['openDate'] as String),
      transactionCount: json['transactionCount'] as int,
      balance: balance,
      updated: DateTime.parse(json['updated'] as String),
      description: json['description'] as String,
      favorite: json['favorite'] as bool,
      inactive: json['inactive'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.toStringValue(),
      'openBalance': openBalance.toString(),
      'openDate': openDate.toIso8601String(),
      'transactionCount': transactionCount,
      'balance': balance.toString(),
      'updated': updated.toIso8601String(),
      'description': description,
      'favorite': favorite,
      'inactive': inactive,
    };
  }
}
