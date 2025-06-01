/// Constants related to Hive storage
class HiveConstants {
  /// Box names
  static const String userSettingsBoxName = 'userSettingsBox';
  static const String accountsBoxName = 'accountsBox';
  static const String categoriesBoxName = 'categoriesBox';
  static const String upcomingsBoxName = 'upcomingsBox';
  static const String transactionsBoxName = 'transactionsBox';
  static const String tagBoxName = 'tagBox';

  /// Constant key names
  static const String userSettingsKey = 'userSettings';

  /// Type IDs
  static const int dateIntervalTypeId = 0;
  static const int userSettingsTypeId = 1;
  static const int accountTypeId = 2;
  static const int accountTypeEnumId = 3;
  static const int decimalTypeId = 4;
  static const int categoryTypeEnumId = 5;
  static const int categoryInfoTypeId = 6;
  static const int accountInfoTypeId = 7;
  static const int upcomingTypeId = 8;
  static const int transactionTypeId = 9;
  static const int categoryTypeId = 10;
  static const int tagTypeId = 11;

  // Platform-specific settings
  /// Maximum size (in bytes) to compact a box automatically (used mainly for web)
  static const int webCompactionSizeThreshold = 1024 * 50; // 50KB

  /// Whether to use lazy box loading (better for large datasets, but not ideal for web)
  /// Lazy boxes only load the data when it's accessed
  static const bool useLazyBoxes = false;

  // Add more type IDs here as you make more classes Hive-compatible
  // Remember that each type must have a unique ID between 0-223
}
