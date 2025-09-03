import 'package:decimal/decimal.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:holefeeder/l10n.dart';

import 'adaptive/adaptive_text_field.dart';

class AmountField extends StatefulWidget {
  final Decimal? initialValue;
  final Function(Decimal)? onChanged;
  final String? labelText;
  final String? hintText;
  final TextStyle? textStyle;
  final bool autofocus;

  const AmountField({
    super.key,
    this.initialValue,
    this.onChanged,
    this.labelText,
    this.hintText,
    this.textStyle,
    this.autofocus = false,
  });

  @override
  State<AmountField> createState() => _AmountFieldState();
}

class _AmountFieldState extends State<AmountField> {
  late TextEditingController _controller;
  late FocusNode _focusNode;
  Decimal _currentValue = Decimal.zero;

  @override
  void initState() {
    super.initState();
    _currentValue = widget.initialValue ?? Decimal.zero;
    _controller = TextEditingController(text: _formatAmount(_currentValue));
    _focusNode = FocusNode();

    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  String _formatAmount(Decimal amount) {
    return amount.toStringAsFixed(2);
  }

  Decimal _parseInput(String input) {
    // Remove any non-digit characters
    String digits = input.replaceAll(RegExp(r'[^\d]'), '');

    if (digits.isEmpty) return Decimal.zero;

    // Convert to decimal by dividing by 100 (last 2 digits become decimal places)
    Decimal numValue = Decimal.parse(digits);
    return (numValue / Decimal.fromInt(100)).toDecimal();
  }

  void _handleFocusChange() {
    if (_focusNode.hasFocus) {
      // Select all text when gaining focus
      _controller.selection = TextSelection(
        baseOffset: 0,
        extentOffset: _controller.text.length,
      );
    } else {
      // Format the value when losing focus
      setState(() {
        _controller.text = _formatAmount(_currentValue);
      });
    }
  }

  void _onTextChanged(String value) {
    Decimal newValue = _parseInput(value);
    String formattedValue = _formatAmount(newValue);

    setState(() {
      _currentValue = newValue;
      // Update display in real-time to show formatted amount
      if (_controller.text != formattedValue) {
        _controller.value = TextEditingValue(
          text: formattedValue,
          selection: TextSelection.collapsed(offset: formattedValue.length),
        );
      }
    });

    // Notify parent widget of the change
    if (widget.onChanged != null) {
      widget.onChanged!(newValue);
    }
  }

  @override
  Widget build(BuildContext context) => AdaptiveTextField(
    labelText: L10nService.current.fieldAmount,
    controller: _controller,
    focusNode: _focusNode,
    autofocus: widget.autofocus,
    keyboardType: TextInputType.number,
    textAlign: TextAlign.right,
    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
    onChanged: _onTextChanged,
  );
}
