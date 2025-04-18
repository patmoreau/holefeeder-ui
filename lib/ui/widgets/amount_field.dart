import 'package:decimal/decimal.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:holefeeder/core/services/services.dart';
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
        ? _buildCupertinoField()
        : _buildMaterialField();
  }

  Widget _buildCupertinoField() => CupertinoTextFormFieldRow(
    placeholder: LocalizationService.current.fieldAmount,
    prefix: Text(LocalizationService.current.fieldAmount),
    controller: _controller,
    focusNode: _focusNode,
    keyboardType: const TextInputType.numberWithOptions(decimal: true),
    textAlign: TextAlign.right,
    inputFormatters: [
      FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}')),
    ],
    onChanged: (value) {
      if (value.isNotEmpty) {
        widget.onChanged(Decimal.parse(value));
      }
    },
    validator: _decimalValidator(),
  );

  Widget _buildMaterialField() => SizedBox(
    width: double.infinity,
    child: TextFormField(
      controller: _controller,
      focusNode: _focusNode,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: InputDecoration(
        labelText: LocalizationService.current.fieldAmount,
        border: OutlineInputBorder(),
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}')),
      ],
      onChanged: (value) {
        if (value.isNotEmpty) {
          widget.onChanged(Decimal.parse(value));
        }
      },
      validator: _decimalValidator(),
    ),
  );

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
}
