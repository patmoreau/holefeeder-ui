import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_picker_field.dart';

import 'adaptive/adaptive_form_row.dart';

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
    return AdaptiveFormRow(
      prefix: Text(L10nService.current.fieldIntervalType),
      child: AdaptivePickerField<DateIntervalType>(
        value: selectedIntervalType,
        items: DateIntervalType.values,
        displayStringFor: _displayName,
        onChanged: onValueChanged,
        placeholder: L10nService.current.fieldIntervalType,
        enabled: enabled,
      ),
    );
  }

  String _displayName(DateIntervalType intervalType) {
    switch (intervalType) {
      case DateIntervalType.weekly:
        return L10nService.current.intervalTypeWeekly;
      case DateIntervalType.monthly:
        return L10nService.current.intervalTypeMonthly;
      case DateIntervalType.yearly:
        return L10nService.current.intervalTypeYearly;
      case DateIntervalType.oneTime:
        return L10nService.current.intervalTypeOneTime;
    }
  }
}
