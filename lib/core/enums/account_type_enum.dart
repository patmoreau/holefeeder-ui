import 'package:decimal/decimal.dart';
import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';

part 'account_type_enum.g.dart';

@HiveType(typeId: HiveConstants.accountTypeEnumId)
enum AccountType {
  @HiveField(0)
  checking,

  @HiveField(1)
  creditCard,

  @HiveField(2)
  creditLine,

  @HiveField(3)
  investment,

  @HiveField(4)
  loan,

  @HiveField(5)
  mortgage,

  @HiveField(6)
  savings,
}

extension AccountTypeExtension on AccountType {
  static AccountType fromString(String type) {
    return AccountType.values.firstWhere(
      (e) => e.toString().split('.').last.toLowerCase() == type.toLowerCase(),
      orElse: () => throw ArgumentError('Invalid AccountType: $type'),
    );
  }

  String toStringValue() {
    return toString().split('.').last;
  }

  Decimal get multiplier {
    switch (this) {
      case AccountType.checking:
      case AccountType.investment:
      case AccountType.savings:
        return Decimal.fromInt(1);
      default:
        return Decimal.fromInt(-1);
    }
  }
}
