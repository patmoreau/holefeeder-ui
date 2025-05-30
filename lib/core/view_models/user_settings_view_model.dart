import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

import 'base_form_state.dart';
import 'base_view_model.dart';
import 'user_settings_form_state.dart';

class UserSettingsViewModel extends BaseViewModel<UserSettingsFormState> {
  final UserSettingsRepository _repository;

  UserSettingsViewModel({
    required UserSettingsRepository repository,
    required super.notificationService,
  }) : _repository = repository,
       super(formState: UserSettingsFormState()) {
    loadInitialData();
  }

  UserSettings? get settings => formState.settings;

  bool get hasSettings => settings != null;

  String? get storeItemId => formState.storeItemId;

  DateInterval get currentPeriod => formState.currentPeriod;

  Future<void> loadInitialData() async {
    await handleAsync(() async {
      final userSettings = await _repository.getDefault();

      updateState(
        (s) => s.copyWith(settings: userSettings, state: ViewFormState.ready),
      );
    });
  }

  /// Get the current period based on today's date
  Future<DateInterval> getCurrentPeriod() async {
    final today = DateTime.now();
    final newPeriod = calculatePeriod(today, settings!);
    updateState((state) => state.copyWith(currentPeriod: newPeriod));
    return newPeriod;
  }

  /// Get period for a specific date
  DateInterval getPeriod(DateTime asOfDate) =>
      calculatePeriod(asOfDate, settings!);

  /// Set the current period based on a specific date
  void setPeriod(DateTime asOfDate) {
    final newPeriod = calculatePeriod(asOfDate, settings!);
    updateState((state) => state.copyWith(currentPeriod: newPeriod));
  }

  /// Calculate the next date after the given date based on settings
  DateTime getNextDate(DateTime asOfDate) =>
      calculateNextDate(asOfDate, settings!);

  /// Calculate the previous date before the given date based on settings
  DateTime getPreviousDate(DateTime asOfDate) {
    if (settings == null) {
      throw Exception('Settings not loaded');
    }

    return calculatePreviousDate(asOfDate, settings!);
  }

  /// Save user settings to the server
  Future<void> saveSettings(UserSettings newSettings) async {
    await handleAsync(() async {
      await _repository.save('userSettings', newSettings);

      updateState(
        (state) => state.copyWith(
          settings: newSettings,
          currentPeriod: null, // Reset current period
        ),
      );

      await showNotification('Settings saved successfully');
    });
  }

  /// Update individual settings field
  Future<void> updateSetting({
    DateTime? effectiveDate,
    DateIntervalType? intervalType,
    int? frequency,
  }) async {
    final updatedSettings = UserSettings(
      effectiveDate: effectiveDate ?? settings!.effectiveDate,
      intervalType: intervalType ?? settings!.intervalType,
      frequency: frequency ?? settings!.frequency,
    );

    await saveSettings(updatedSettings);
  }

  /// Calculate the period based on a given date and settings
  DateInterval calculatePeriod(DateTime asOfDate, UserSettings settings) {
    final DateTime start = _startOfDay(asOfDate);
    final DateTime end = calculateNextDate(start, settings);

    DateTime periodStart;
    DateTime periodEnd;

    switch (settings.intervalType) {
      case DateIntervalType.weekly:
        if (_compareAsc(start, end) == 0) {
          periodEnd = _addWeeks(end, settings.frequency);
        } else {
          periodStart = _addWeeks(end, -settings.frequency);
          periodEnd = end;
          return DateInterval(periodStart, _addDays(periodEnd, -1));
        }
        break;
      case DateIntervalType.monthly:
        if (_compareAsc(start, end) == 0) {
          periodEnd = _addMonths(end, settings.frequency);
        } else {
          periodStart = _addMonths(end, -settings.frequency);
          periodEnd = end;
          return DateInterval(periodStart, _addDays(periodEnd, -1));
        }
        break;
      case DateIntervalType.yearly:
        if (_compareAsc(start, end) == 0) {
          periodEnd = _addYears(end, settings.frequency);
        } else {
          periodStart = _addYears(end, -settings.frequency);
          periodEnd = end;
          return DateInterval(periodStart, _addDays(periodEnd, -1));
        }
        break;
      case DateIntervalType.oneTime:
        periodStart = _startOfDay(settings.effectiveDate);
        periodEnd = _addDays(periodStart, 1);
        break;
    }

    return DateInterval(start, _addDays(periodEnd, -1));
  }

  /// Calculate the next date after the given date based on settings
  DateTime calculateNextDate(DateTime asOfDate, UserSettings settings) {
    if (settings.intervalType == DateIntervalType.oneTime) {
      return _startOfDay(settings.effectiveDate);
    }

    DateTime start = _startOfDay(settings.effectiveDate);
    int count = 0;

    while (_compareAsc(start, asOfDate) == -1) {
      start = _nextRecurrence(count, settings);
      count++;
    }

    return _startOfDay(start);
  }

  /// Calculate the previous date before the given date based on settings
  DateTime calculatePreviousDate(DateTime asOfDate, UserSettings settings) {
    if (settings.intervalType == DateIntervalType.oneTime ||
        _compareAsc(asOfDate, settings.effectiveDate) != 1) {
      return _startOfDay(settings.effectiveDate);
    }

    DateTime start = _startOfDay(settings.effectiveDate);
    int count = 0;

    while (_compareAsc(start, asOfDate) == -1) {
      count++;
      start = _nextRecurrence(count, settings);
    }

    return _nextRecurrence(count - 1, settings);
  }

  /// Calculate the next recurrence date based on settings
  DateTime _nextRecurrence(int amount, UserSettings settings) {
    switch (settings.intervalType) {
      case DateIntervalType.weekly:
        return _addWeeks(settings.effectiveDate, settings.frequency * amount);
      case DateIntervalType.monthly:
        return _addMonths(settings.effectiveDate, settings.frequency * amount);
      case DateIntervalType.yearly:
        return _addYears(settings.effectiveDate, settings.frequency * amount);
      case DateIntervalType.oneTime:
        return _startOfDay(settings.effectiveDate);
    }
  }

  /// Helper for date comparison
  /// Returns -1 if date1 is before date2, 0 if equal, 1 if after
  int _compareAsc(DateTime date1, DateTime date2) {
    final d1 = _startOfDay(date1);
    final d2 = _startOfDay(date2);

    if (d1.isBefore(d2)) return -1;
    if (d1.isAfter(d2)) return 1;
    return 0;
  }

  /// Get just the date part (no time)
  DateTime _startOfDay(DateTime date) {
    return DateTime(date.year, date.month, date.day);
  }

  /// Add days to a date
  DateTime _addDays(DateTime date, int days) {
    return date.add(Duration(days: days));
  }

  /// Add weeks to a date
  DateTime _addWeeks(DateTime date, int weeks) {
    return date.add(Duration(days: weeks * 7));
  }

  /// Add months to a date
  DateTime _addMonths(DateTime date, int months) {
    int newMonth = date.month + months;
    int newYear = date.year;

    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }

    while (newMonth < 1) {
      newMonth += 12;
      newYear -= 1;
    }

    // Handle month with fewer days
    final lastDayOfMonth = DateTime(newYear, newMonth + 1, 0).day;
    final day = date.day > lastDayOfMonth ? lastDayOfMonth : date.day;

    return DateTime(newYear, newMonth, day);
  }

  /// Add years to a date
  DateTime _addYears(DateTime date, int years) {
    return DateTime(date.year + years, date.month, date.day);
  }
}
