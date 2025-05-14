import 'package:decimal/decimal.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// A widget that displays a [Decimal] value as currency using the system's locale.
class CurrencyText extends StatelessWidget {
  /// The decimal value to display as currency
  final Decimal value;

  /// Optional text style to apply to the currency text
  final TextStyle? style;

  /// Optional text alignment for the currency text
  final TextAlign? textAlign;

  const CurrencyText({
    super.key,
    required this.value,
    this.style,
    this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    // Get the system locale
    final locale = Intl.getCurrentLocale();
    // Create a formatter for currency based on the locale
    final formatter = NumberFormat.currency(
      locale: locale,
      // Use the locale's default currency symbol
      symbol: NumberFormat.simpleCurrency(locale: locale).currencySymbol,
    );
    final String formattedAmount = formatter.format(value.toDouble());

    return Text(formattedAmount, style: style, textAlign: textAlign);
  }
}
