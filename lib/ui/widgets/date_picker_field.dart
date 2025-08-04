import 'package:cupertino_calendar_picker/cupertino_calendar_picker.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:intl/intl.dart';
import 'package:universal_platform/universal_platform.dart';

class DatePickerField extends StatelessWidget {
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateChanged;

  const DatePickerField({
    super.key,
    required this.selectedDate,
    required this.onDateChanged,
  });

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? _buildCupertinoDatePicker(context)
        : _buildMaterialDatePicker(context);
  }

  Widget _buildCupertinoDatePicker(BuildContext context) {
    return CupertinoFormRow(
      prefix: Text(L10nService.current.fieldDate),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          CupertinoCalendarPickerButton(
            minimumDateTime: selectedDate.subtract(const Duration(days: 365)),
            maximumDateTime: selectedDate.add(const Duration(days: 365)),
            initialDateTime: selectedDate,
            mode: CupertinoCalendarMode.date,
            onDateTimeChanged: onDateChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildMaterialDatePicker(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          alignment: Alignment.centerLeft,
        ),
        onPressed: () => _showMaterialDatePicker(context),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              L10nService.current.fieldDate,
              style: TextStyle(fontSize: 12, color: Colors.black54),
            ),
            const SizedBox(height: 4),
            Text(
              DateFormat('yyyy-MM-dd').format(selectedDate),
              style: const TextStyle(fontSize: 16, color: Colors.black87),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showMaterialDatePicker(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (picked != null && picked != selectedDate) {
      onDateChanged(picked);
    }
  }
}
