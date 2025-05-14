import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:intl/intl.dart';

class UserSettings {
  final DateTime effectiveDate;
  final DateIntervalType intervalType;
  final int frequency;

  const UserSettings({
    required this.effectiveDate,
    required this.intervalType,
    required this.frequency,
  });

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
