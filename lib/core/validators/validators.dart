import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/services/services.dart';

String? Function(String?) decimalValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return LocalizationService.current.validationDecimalNumber;
  }
  try {
    Decimal.parse(value);
    return null;
  } catch (_) {
    return LocalizationService.current.validationDecimalNumber;
  }
};

String? Function(String?) zeroOrPositiveValueValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return LocalizationService.current.validationPositiveNumber;
  }
  try {
    var intValue = int.parse(value);
    if (intValue < 0) {
      return LocalizationService.current.validationPositiveNumber;
    }
    return null;
  } catch (_) {
    return LocalizationService.current.validationPositiveNumber;
  }
};

String? Function(String?) greatherThanZeroValueValidator() => (String? value) {
  if (value == null || value.isEmpty) {
    return LocalizationService.current.validationNumberGreaterThanZero;
  }
  try {
    var intValue = int.parse(value);
    if (intValue <= 0) {
      return LocalizationService.current.validationNumberGreaterThanZero;
    }
    return null;
  } catch (_) {
    return LocalizationService.current.validationNumberGreaterThanZero;
  }
};
