import 'package:decimal/decimal.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/validators/validators.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';

class AmountField extends StatefulWidget {
  final Decimal initialValue;
  final ValueChanged<Decimal> onChanged;
  final bool autofocus;

  const AmountField({
    super.key,
    required this.initialValue,
    required this.onChanged,
    this.autofocus = false,
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

    if (widget.autofocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _focusNode.requestFocus();
        _controller.selection = TextSelection(
          baseOffset: 0,
          extentOffset: _controller.text.length,
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AdaptiveTextField(
      labelText: LocalizationService.current.fieldAmount,
      controller: _controller,
      focusNode: _focusNode,
      autofocus: widget.autofocus,
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
      validator: decimalValidator(),
    );
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
}
