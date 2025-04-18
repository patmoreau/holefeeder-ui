// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Holefeeder';

  @override
  String get categories => 'Categories';

  @override
  String get dashboard => 'Dashboard';

  @override
  String get errorGeneric => 'An error occurred';

  @override
  String helloUser(String userName) {
    return 'Hello $userName';
  }

  @override
  String get holefeederTitle => 'Holefeeder';

  @override
  String get home => 'Home';

  @override
  String get profile => 'Profile';

  @override
  String get retry => 'Retry';

  @override
  String get welcomeMessage => 'Welcome to our app';
}
