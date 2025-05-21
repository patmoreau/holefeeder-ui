import 'package:decimal/decimal.dart';
import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';

part 'category_type_enum.g.dart';

@HiveType(typeId: HiveConstants.categoryTypeEnumId)
enum CategoryType {
  @HiveField(0)
  expense,

  @HiveField(1)
  gain,
}

extension CategoryTypeExtension on CategoryType {
  static CategoryType fromString(String type) {
    return CategoryType.values.firstWhere(
      (e) => e.toString().split('.').last.toLowerCase() == type.toLowerCase(),
      orElse: () => throw ArgumentError('Invalid CategoryType: $type'),
    );
  }

  String toStringValue() {
    return toString().split('.').last;
  }

  Decimal get multiplier {
    switch (this) {
      case CategoryType.expense:
        return Decimal.fromInt(-1);
      case CategoryType.gain:
        return Decimal.fromInt(1);
    }
  }
}
