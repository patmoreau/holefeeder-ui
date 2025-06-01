import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveTextField extends StatelessWidget {
  final String? labelText;
  final String? initialValue;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final bool autofocus;
  final String? Function(String?)? validator;
  final ValueChanged<String> onChanged;
  final TextInputType? keyboardType;
  final TextAlign textAlign;
  final List<TextInputFormatter>? inputFormatters;

  const AdaptiveTextField({
    super.key,
    this.initialValue,
    required this.onChanged,
    this.labelText,
    this.controller,
    this.focusNode,
    this.autofocus = false,
    this.validator,
    this.keyboardType,
    this.textAlign = TextAlign.start,
    this.inputFormatters,
  });

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? CupertinoTextFormFieldRow(
          prefix: labelText != null ? Text(labelText!) : null,
          initialValue: initialValue,
          controller: controller,
          focusNode: focusNode,
          autofocus: autofocus,
          onChanged: onChanged,
          validator: validator,
          keyboardType: keyboardType,
          textAlign: textAlign,
          inputFormatters: inputFormatters,
        )
        : TextFormField(
          decoration: InputDecoration(labelText: labelText, filled: true),
          initialValue: initialValue,
          controller: controller,
          focusNode: focusNode,
          autofocus: autofocus,
          validator: validator,
          onChanged: onChanged,
          keyboardType: keyboardType,
          textAlign: textAlign,
          inputFormatters: inputFormatters,
        );
  }
}
