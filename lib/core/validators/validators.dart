import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/services/services.dart';

String? Function(String?) decimalValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return L10nService.current.validationDecimalNumber;
  }
  try {
    Decimal.parse(value);
    return null;
  } catch (_) {
    return L10nService.current.validationDecimalNumber;
  }
};

String? Function(String?) zeroOrPositiveValueValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return L10nService.current.validationPositiveNumber;
  }
  try {
    var intValue = int.parse(value);
    if (intValue < 0) {
      return L10nService.current.validationPositiveNumber;
    }
    return null;
  } catch (_) {
    return L10nService.current.validationPositiveNumber;
  }
};

String? Function(String?) greatherThanZeroValueValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return L10nService.current.validationNumberGreaterThanZero;
  }
  try {
    var intValue = int.parse(value);
    if (intValue <= 0) {
      return L10nService.current.validationNumberGreaterThanZero;
    }
    return null;
  } catch (_) {
    return L10nService.current.validationNumberGreaterThanZero;
  }
};
