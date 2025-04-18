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
  AppLocalizations(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

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
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('fr')
  ];

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

  /// The categories screen title
  ///
  /// In en, this message translates to:
  /// **'Categories'**
  String get categories;

  /// The dashboard screen title
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get dashboard;

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

  /// Placeholder text for the account field
  ///
  /// In en, this message translates to:
  /// **'Select your account'**
  String get fieldAccountPlaceHolder;

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

  /// A note or message
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get note;

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

  /// The title of the purchase screen
  ///
  /// In en, this message translates to:
  /// **'Make purchase'**
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

  /// A welcome message for the app
  ///
  /// In en, this message translates to:
  /// **'Welcome to our app'**
  String get welcomeMessage;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['en', 'fr'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {


  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en': return AppLocalizationsEn();
    case 'fr': return AppLocalizationsFr();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.'
  );
}
