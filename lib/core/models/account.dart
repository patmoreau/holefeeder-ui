import 'package:decimal/decimal.dart';
import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/enums/enums.dart';

part 'account.g.dart';

@HiveType(typeId: HiveConstants.accountTypeId)
class Account {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final AccountType type;

  @HiveField(3)
  final Decimal openBalance;

  @HiveField(4)
  final DateTime openDate;

  @HiveField(5)
  final int transactionCount;

  @HiveField(6)
  final Decimal balance;

  @HiveField(7)
  final DateTime updated;

  @HiveField(8)
  final String description;

  @HiveField(9)
  final bool favorite;

  @HiveField(10)
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

  // Static empty Account instance
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
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Account &&
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
          inactive == other.inactive;

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
