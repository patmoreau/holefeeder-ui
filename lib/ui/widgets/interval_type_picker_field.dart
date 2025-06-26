import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_picker.dart';

class IntervalTypePickerField extends StatelessWidget {
  final DateIntervalType selectedIntervalType;
  final ValueChanged<DateIntervalType?> onValueChanged;
  final bool enabled;

  const IntervalTypePickerField({
    super.key,
    required this.selectedIntervalType,
    required this.onValueChanged,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return AdaptivePicker<DateIntervalType>(
      label: LocalizationService.current.fieldIntervalType,
      value: selectedIntervalType,
      items: DateIntervalType.values,
      displayStringFor: _displayName,
      onChanged: onValueChanged,
      placeholder: LocalizationService.current.fieldIntervalType,
      enabled: enabled,
    );
  }

  String _displayName(DateIntervalType intervalType) {
    switch (intervalType) {
      case DateIntervalType.weekly:
        return LocalizationService.current.intervalTypeWeekly;
      case DateIntervalType.monthly:
        return LocalizationService.current.intervalTypeMonthly;
      case DateIntervalType.yearly:
        return LocalizationService.current.intervalTypeYearly;
      case DateIntervalType.oneTime:
        return LocalizationService.current.intervalTypeOneTime;
    }
  }
}
