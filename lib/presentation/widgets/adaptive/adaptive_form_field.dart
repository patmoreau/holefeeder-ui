import 'package:flutter/widgets.dart';
import 'package:holefeeder/core.dart';

import 'adaptive_form_row.dart';

/// A specialized adaptive form row for text inputs with label
class AdaptiveFormField extends StatelessWidget {
  /// The label text
  final String label;

  /// The form field widget (TextField, AdaptivePickerField, etc.)
  final Widget field;

  /// Optional helper text
  final String? helper;

  /// Optional error text
  final String? error;

  /// Whether the field is required (shows asterisk)
  final bool required;

  /// Custom padding
  final EdgeInsetsGeometry? padding;

  const AdaptiveFormField({
    super.key,
    required this.label,
    required this.field,
    this.helper,
    this.error,
    this.required = false,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final labelWidget = RichText(
      text: TextSpan(
        style: AppThemes.getFormLabelTextStyle(context),
        children: [
          TextSpan(text: label),
          if (required)
            TextSpan(
              text: ' *',
              style: TextStyle(color: AppThemes.getErrorIconColor(context)),
            ),
        ],
      ),
    );

    return AdaptiveFormRow(
      prefix: labelWidget,
      padding: padding,
      helper: helper,
      error: error,
      child: field,
    );
  }
}
