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
  String get back => 'Back';

  @override
  String get categories => 'Categories';

  @override
  String get dashboard => 'Dashboard';

  @override
  String get errorGeneric => 'An error occurred';

  @override
  String get fieldAccount => 'Account';

  @override
  String get fieldAccountPlaceHolder => 'Select your account';

  @override
  String get fieldAmount => 'Amount';

  @override
  String get fieldCashflow => 'Cashflow';

  @override
  String get fieldCategory => 'Category';

  @override
  String get fieldCategoryPlaceHolder => 'Select your category';

  @override
  String get fieldFrequency => 'Frequency';

  @override
  String get fieldIntervalType => 'Interval type';

  @override
  String get fieldRecurrence => 'Recurrence';

  @override
  String helloUser(String userName) {
    return 'Hello $userName';
  }

  @override
  String get holefeederTitle => 'Holefeeder';

  @override
  String get home => 'Home';

  @override
  String get intervalTypeWeekly => 'Weekly';

  @override
  String get intervalTypeMonthly => 'Monthly';

  @override
  String get intervalTypeYearly => 'Yearly';

  @override
  String get intervalTypeOneTime => 'One time';

  @override
  String get note => 'Note';

  @override
  String get profile => 'Profile';

  @override
  String get purchase => 'Purchase';

  @override
  String get purchaseTitle => 'Make purchase';

  @override
  String get retry => 'Retry';

  @override
  String get save => 'Save';

  @override
  String get welcomeMessage => 'Welcome to our app';
}
