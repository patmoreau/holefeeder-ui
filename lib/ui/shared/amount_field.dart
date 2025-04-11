import 'package:decimal/decimal.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:universal_platform/universal_platform.dart';

class AmountField extends StatefulWidget {
  final Decimal initialValue;
  final ValueChanged<Decimal> onChanged;

  const AmountField({
    super.key,
    required this.initialValue,
    required this.onChanged,
  });

  @override
  State<AmountField> createState() => _AmountFieldState();
}

class _AmountFieldState extends State<AmountField> {
  late TextEditingController _controller;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue.toString());
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (!_focusNode.hasFocus) {
      final currentValue = _controller.text;
      if (currentValue.isEmpty) {
        _controller.text = '0.00';
      } else if (!currentValue.contains('.')) {
        _controller.text = '$currentValue.00';
      } else {
        final parts = currentValue.split('.');
        if (parts[1].length < 2) {
          _controller.text = '${parts[0]}.${parts[1].padRight(2, '0')}';
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? CupertinoFormRow(
          prefix: const Text('Amount'),
          child: CupertinoTextFormFieldRow(
            controller: _controller,
            focusNode: _focusNode,
            textAlign: TextAlign.right,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [_decimalTextInputFormatter()],
            onChanged: (value) => _onDecimalChanged(value, widget.onChanged),
            validator: _decimalValidator(),
          ),
        )
        : TextFormField(
          decoration: const InputDecoration(
            labelText: 'Amount',
            filled: true,
            alignLabelWithHint: true,
          ),
          controller: _controller,
          focusNode: _focusNode,
          textAlign: TextAlign.right,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [_decimalTextInputFormatter()],
          onChanged: (value) => _onDecimalChanged(value, widget.onChanged),
          validator: _decimalValidator(),
        );
  }
}

TextInputFormatter _decimalTextInputFormatter() =>
    TextInputFormatter.withFunction((oldValue, newValue) {
      final text = newValue.text;
      if (text.isEmpty) return newValue;
      final isValid = RegExp(r'^\d*\.?\d{0,2}$').hasMatch(text);
      return isValid ? newValue : oldValue;
    });

void _onDecimalChanged(String value, ValueChanged<Decimal> onChanged) {
  if (value.isEmpty) {
    onChanged(Decimal.zero);
  } else {
    try {
      final decimal = Decimal.parse(value);
      onChanged(decimal);
    } catch (_) {
      // Invalid decimal format, ignore
    }
  }
}

String? Function(String?) _decimalValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return 'Please enter an amount';
  }
  try {
    Decimal.parse(value);
    return null;
  } catch (_) {
    return 'Please enter a valid amount';
  }
};
