import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class PlatformTextField extends StatelessWidget {
  final String? labelText;
  final String initialValue;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final ValueChanged<String> onChanged;
  final TextInputType? keyboardType;
  final TextAlign textAlign;

  const PlatformTextField({
    super.key,
    required this.initialValue,
    required this.onChanged,
    this.labelText,
    this.controller,
    this.validator,
    this.keyboardType,
    this.textAlign = TextAlign.start,
  });

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? CupertinoFormRow(
          prefix: labelText != null ? Text(labelText!) : null,
          child: CupertinoTextFormFieldRow(
            initialValue: initialValue,
            controller: controller,
            onChanged: onChanged,
            validator: validator,
            keyboardType: keyboardType,
            textAlign: textAlign,
          ),
        )
        : TextFormField(
          decoration: InputDecoration(labelText: labelText, filled: true),
          initialValue: initialValue,
          controller: controller,
          validator: validator,
          onChanged: onChanged,
          keyboardType: keyboardType,
          textAlign: textAlign,
        );
  }
}
