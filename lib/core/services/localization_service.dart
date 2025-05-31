import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:holefeeder/l10n/generated/app_localizations.dart';

class LocalizationService {
  static AppLocalizations? _localizations;
  static Locale? _deviceLocale;
  static final LocalizationService _instance = LocalizationService._internal();

  factory LocalizationService() {
    return _instance;
  }

  LocalizationService._internal();

  static void initialize(BuildContext context) {
    _localizations = AppLocalizations.of(context);
    _deviceLocale = View.of(context).platformDispatcher.locale;
  }

  static AppLocalizations get current {
    if (_localizations == null) {
      throw Exception(
        'LocalizationService not initialized. Call initialize() first with a valid BuildContext.',
      );
    }
    return _localizations!;
  }

  static Locale get device {
    if (_deviceLocale == null) {
      throw Exception(
        'LocalizationService not initialized. Call initialize() first with a valid BuildContext.',
      );
    }
    return _deviceLocale!;
  }
}
