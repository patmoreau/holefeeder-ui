import 'package:hive_ce/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:intl/intl.dart';

import 'hive_key.dart';

class UserSettings extends HiveObject with HiveKey {
  final DateTime effectiveDate;

  final DateIntervalType intervalType;

  final int frequency;

  UserSettings({
    required this.effectiveDate,
    required this.intervalType,
    required this.frequency,
  });

  static final UserSettings empty = UserSettings(
    effectiveDate: DateTime(1970, 1, 1),
    intervalType: DateIntervalType.monthly,
    frequency: 1,
  );

  @override
  String get key => createKey();

  static String createKey() => HiveConstants.userSettingsKey;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserSettings &&
          effectiveDate == other.effectiveDate &&
          intervalType == other.intervalType &&
          frequency == other.frequency;

  @override
  int get hashCode =>
      effectiveDate.hashCode ^ intervalType.hashCode ^ frequency.hashCode;

  factory UserSettings.fromJson(Map<String, dynamic> json) {
    return UserSettings(
      effectiveDate: DateTime.parse(json['effectiveDate'] as String),
      intervalType: DateIntervalTypeExtension.fromString(
        json['intervalType'] as String,
      ),
      frequency: json['frequency'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'effectiveDate': DateFormat('yyyy-MM-dd').format(effectiveDate),
      'intervalType': intervalType.toStringValue(),
      'frequency': frequency,
    };
  }
}
