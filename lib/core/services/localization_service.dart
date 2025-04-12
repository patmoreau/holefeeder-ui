import 'package:flutter/widgets.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/l10n/l10n.dart';

class LocalizationService {
  static AppLocalizations? _localizations;
  static final LocalizationService _instance = LocalizationService._internal();

  factory LocalizationService() {
    return _instance;
  }

  LocalizationService._internal();

  static void initialize(BuildContext context) {
    _localizations = AppLocalizations.of(context);
  }

  static AppLocalizations get current {
    if (_localizations == null) {
      throw Exception(
        'LocalizationService not initialized. Call initialize() first with a valid BuildContext.',
      );
    }
    return _localizations!;
  }
}
