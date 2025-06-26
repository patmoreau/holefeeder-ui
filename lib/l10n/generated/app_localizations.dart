import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_fr.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('fr'),
  ];

  /// A button to add a new item
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get add;

  /// The application name
  ///
  /// In en, this message translates to:
  /// **'Holefeeder'**
  String get appTitle;

  /// A button to go back to the previous screen
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get back;

  /// A button to confirm an action
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get buttonOk;

  /// A button to cancel an action
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// A button to cancel an upcoming cashflow
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancelUpcoming;

  /// Confirmation message for canceling an upcoming cashflow
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to cancel this upcoming cashflow?'**
  String get cancelUpcomingMessage;

  /// The title of the cancel upcoming cashflow dialog
  ///
  /// In en, this message translates to:
  /// **'Cancel upcoming cashflow'**
  String get cancelUpcomingTitle;

  /// A single cashflow item
  ///
  /// In en, this message translates to:
  /// **'Cashflow'**
  String get cashflow;

  /// A list cashflow items
  ///
  /// In en, this message translates to:
  /// **'Cashflows'**
  String get cashflows;

  /// The categories screen title
  ///
  /// In en, this message translates to:
  /// **'Categories'**
  String get categories;

  /// A button to clear all data
  ///
  /// In en, this message translates to:
  /// **'Clear data'**
  String get clearData;

  /// Confirmation message for clearing all data
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to clear all data? This action cannot be undone.'**
  String get clearDataMessage;

  /// The title of the clear data dialog
  ///
  /// In en, this message translates to:
  /// **'Clear data'**
  String get clearDataTitle;

  /// The dashboard screen title
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get dashboard;

  /// The button of the delete cashflow dialog
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get deleteCashflow;

  /// Confirmation message for deleting a cashflow
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to this current and all future cashflow?'**
  String get deleteCashflowMessage;

  /// The title of the delete cashflow dialog
  ///
  /// In en, this message translates to:
  /// **'Delete cashflow'**
  String get deleteCashflowTitle;

  /// A generic error message
  ///
  /// In en, this message translates to:
  /// **'An error occurred'**
  String get errorGeneric;

  /// The account field label
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get fieldAccount;

  /// The from account field label
  ///
  /// In en, this message translates to:
  /// **'From account'**
  String get fieldAccountFrom;

  /// Placeholder text for the account field
  ///
  /// In en, this message translates to:
  /// **'Select your account'**
  String get fieldAccountPlaceHolder;

  /// The to account field label
  ///
  /// In en, this message translates to:
  /// **'To account'**
  String get fieldAccountTo;

  /// The amount field label
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get fieldAmount;

  /// The cashflow field label
  ///
  /// In en, this message translates to:
  /// **'Cashflow'**
  String get fieldCashflow;

  /// The category field label
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get fieldCategory;

  /// Placeholder text for the category field
  ///
  /// In en, this message translates to:
  /// **'Select your category'**
  String get fieldCategoryPlaceHolder;

  /// The date field label
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get fieldDate;

  /// The frequency field label
  ///
  /// In en, this message translates to:
  /// **'Frequency'**
  String get fieldFrequency;

  /// The interval type field label
  ///
  /// In en, this message translates to:
  /// **'Interval type'**
  String get fieldIntervalType;

  /// The recurrence field label
  ///
  /// In en, this message translates to:
  /// **'Recurrence'**
  String get fieldRecurrence;

  /// The tags field label
  ///
  /// In en, this message translates to:
  /// **'Tags'**
  String get fieldTags;

  /// The tags field place holder
  ///
  /// In en, this message translates to:
  /// **'Add hashtag'**
  String get fieldTagsPlaceHolder;

  /// A welcome message with the user's name.
  ///
  /// In en, this message translates to:
  /// **'Hello {userName}'**
  String helloUser(String userName);

  /// A simple hello world message
  ///
  /// In en, this message translates to:
  /// **'Holefeeder'**
  String get holefeederTitle;

  /// The home screen title
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get home;

  /// Weekly interval type
  ///
  /// In en, this message translates to:
  /// **'Weekly'**
  String get intervalTypeWeekly;

  /// Monthly interval type
  ///
  /// In en, this message translates to:
  /// **'Monthly'**
  String get intervalTypeMonthly;

  /// Yearly interval type
  ///
  /// In en, this message translates to:
  /// **'Yearly'**
  String get intervalTypeYearly;

  /// One time interval type
  ///
  /// In en, this message translates to:
  /// **'One time'**
  String get intervalTypeOneTime;

  /// The last updated timestamp
  ///
  /// In en, this message translates to:
  /// **'Last updated'**
  String get lastUpdated;

  /// The title of the login screen
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get loginTitle;

  /// The title of the logout confirmation dialog
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get logoutTitle;

  /// A note or message
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get note;

  /// The title of the error notification
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get notificationServiceErrorTitle;

  /// The title of the success notification
  ///
  /// In en, this message translates to:
  /// **'Success'**
  String get notificationServiceSuccessTitle;

  /// The profile screen title
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profile;

  /// A button to purchase an item
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get purchase;

  /// The title of the additional details in the purchase screen
  ///
  /// In en, this message translates to:
  /// **'Additional details'**
  String get purchaseAdditionalDetails;

  /// The title of the basic details in the purchase screen
  ///
  /// In en, this message translates to:
  /// **'Basic details'**
  String get purchaseBasicDetails;

  /// The title of the cashflow details in the purchase screen
  ///
  /// In en, this message translates to:
  /// **'Cashflow details'**
  String get purchaseCashflowDetails;

  /// The title of the purchase screen
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get purchaseTitle;

  /// A button to retry an action
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// A button to save changes
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// An error prompt to select an account
  ///
  /// In en, this message translates to:
  /// **'An account must be selected'**
  String get selectAccountError;

  /// An error prompt to select a category
  ///
  /// In en, this message translates to:
  /// **'A category must be selected'**
  String get selectCategoryError;

  /// A button to show inactive items
  ///
  /// In en, this message translates to:
  /// **'Show inactive'**
  String get showInactive;

  /// A single transaction
  ///
  /// In en, this message translates to:
  /// **'Transaction'**
  String get transaction;

  /// The transactions screen title
  ///
  /// In en, this message translates to:
  /// **'Transactions'**
  String get transactions;

  /// The transactions list is empty
  ///
  /// In en, this message translates to:
  /// **'No transactions found'**
  String get transactionsEmpty;

  /// A button to transfer an item
  ///
  /// In en, this message translates to:
  /// **'Transfer'**
  String get transfer;

  /// The upcoming screen title
  ///
  /// In en, this message translates to:
  /// **'Upcoming'**
  String get upcoming;

  /// The upcoming list is empty
  ///
  /// In en, this message translates to:
  /// **'No upcoming cashflows'**
  String get upcomingEmpty;

  /// Validation message for decimal number input
  ///
  /// In en, this message translates to:
  /// **'Please enter a positive decimal number'**
  String get validationDecimalNumber;

  /// Validation message for number greater than zero input
  ///
  /// In en, this message translates to:
  /// **'Please enter a number greater than zero'**
  String get validationNumberGreaterThanZero;

  /// Validation message for positive number input
  ///
  /// In en, this message translates to:
  /// **'Please enter a positive number'**
  String get validationPositiveNumber;

  /// A welcome message for the app
  ///
  /// In en, this message translates to:
  /// **'Welcome to our app'**
  String get welcomeMessage;

  /// A button to confirm an action
  ///
  /// In en, this message translates to:
  /// **'Yes'**
  String get yes;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'fr'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'fr':
      return AppLocalizationsFr();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
