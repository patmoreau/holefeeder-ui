import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:holefeeder/l10n/generated/app_localizations.dart';

class L10nService {
  static AppLocalizations? _localizations;
  static Locale? _deviceLocale;
  static final L10nService _instance = L10nService._internal();

  factory L10nService() {
    return _instance;
  }

  L10nService._internal();

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
