// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get add => 'Add';

  @override
  String get appTitle => 'Holefeeder';

  @override
  String get back => 'Back';

  @override
  String get buttonOk => 'OK';

  @override
  String get cancel => 'Cancel';

  @override
  String get cancelUpcoming => 'Cancel';

  @override
  String get cancelUpcomingMessage =>
      'Are you sure you want to cancel this upcoming cashflow?';

  @override
  String get cancelUpcomingTitle => 'Cancel upcoming cashflow';

  @override
  String get categories => 'Categories';

  @override
  String get dashboard => 'Dashboard';

  @override
  String get deleteCashflow => 'Delete';

  @override
  String get deleteCashflowMessage =>
      'Are you sure you want to this current and all future cashflow?';

  @override
  String get deleteCashflowTitle => 'Delete cashflow';

  @override
  String get errorGeneric => 'An error occurred';

  @override
  String get fieldAccount => 'Account';

  @override
  String get fieldAccountFrom => 'From account';

  @override
  String get fieldAccountPlaceHolder => 'Select your account';

  @override
  String get fieldAccountTo => 'To account';

  @override
  String get fieldAmount => 'Amount';

  @override
  String get fieldCashflow => 'Cashflow';

  @override
  String get fieldCategory => 'Category';

  @override
  String get fieldCategoryPlaceHolder => 'Select your category';

  @override
  String get fieldDate => 'Date';

  @override
  String get fieldFrequency => 'Frequency';

  @override
  String get fieldIntervalType => 'Interval type';

  @override
  String get fieldRecurrence => 'Recurrence';

  @override
  String get fieldTags => 'Tags';

  @override
  String get fieldTagsPlaceHolder => 'Add hashtag';

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
  String get lastUpdated => 'Last updated';

  @override
  String get loginTitle => 'Login';

  @override
  String get logoutTitle => 'Logout';

  @override
  String get note => 'Note';

  @override
  String get notificationServiceErrorTitle => 'Error';

  @override
  String get notificationServiceSuccessTitle => 'Success';

  @override
  String get profile => 'Profile';

  @override
  String get purchase => 'Purchase';

  @override
  String get purchaseAdditionalDetails => 'Additional details';

  @override
  String get purchaseBasicDetails => 'Basic details';

  @override
  String get purchaseCashflowDetails => 'Cashflow details';

  @override
  String get purchaseTitle => 'Purchase';

  @override
  String get retry => 'Retry';

  @override
  String get save => 'Save';

  @override
  String get selectAccountError => 'An account must be selected';

  @override
  String get selectCategoryError => 'A category must be selected';

  @override
  String get transactions => 'Transactions';

  @override
  String get transactionsEmpty => 'No transactions found';

  @override
  String get transfer => 'Transfer';

  @override
  String get upcoming => 'Upcoming';

  @override
  String get upcomingEmpty => 'No upcoming cashflows';

  @override
  String get validationDecimalNumber =>
      'Please enter a positive decimal number';

  @override
  String get validationNumberGreaterThanZero =>
      'Please enter a number greater than zero';

  @override
  String get validationPositiveNumber => 'Please enter a positive number';

  @override
  String get welcomeMessage => 'Welcome to our app';

  @override
  String get yes => 'Yes';
}
