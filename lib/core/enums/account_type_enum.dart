import 'package:decimal/decimal.dart';

enum AccountType {
  checking,
  creditCard,
  creditLine,
  investment,
  loan,
  mortgage,
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
