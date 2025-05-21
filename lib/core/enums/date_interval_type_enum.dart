import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';

part 'date_interval_type_enum.g.dart';

@HiveType(typeId: HiveConstants.dateIntervalTypeId)
enum DateIntervalType {
  @HiveField(0)
  weekly,

  @HiveField(1)
  monthly,

  @HiveField(2)
  yearly,

  @HiveField(3)
  oneTime,
}

extension DateIntervalTypeExtension on DateIntervalType {
  static DateIntervalType fromString(String type) {
    return DateIntervalType.values.firstWhere(
      (e) => e.toString().split('.').last.toLowerCase() == type.toLowerCase(),
      orElse: () => throw ArgumentError('Invalid DateIntervalType: $type'),
    );
  }

  String toStringValue() {
    return toString().split('.').last;
  }
}
