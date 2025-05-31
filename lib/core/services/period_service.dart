import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

class PeriodService {
  final UserSettingsRepository _settingsRepository;

  PeriodService({required UserSettingsRepository settingsRepository})
    : _settingsRepository = settingsRepository;

  Future<DateInterval> getCurrentPeriod() async {
    final today = DateTime.now();
    return calculatePeriod(today);
  }

  Future<DateInterval> calculatePeriod(DateTime asOfDate) async {
    final settings = await _settingsRepository.getDefault();
    if (settings == UserSettings.empty) {
      throw Exception('User settings not found');
    }

    final DateTime start = _startOfDay(asOfDate);
    final DateTime end = await calculateNextDate(start);

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
  Future<DateTime> calculateNextDate(DateTime asOfDate) async {
    final settings = await _settingsRepository.get('userSettings');
    if (settings == UserSettings.empty) {
      throw Exception('User settings not found');
    }

    if (settings.intervalType == DateIntervalType.oneTime) {
      return _startOfDay(settings.effectiveDate);
    }

    DateTime start = _startOfDay(settings.effectiveDate);
    int count = 0;

    while (_compareAsc(start, asOfDate) == -1) {
      start = await _nextRecurrence(count);
      count++;
    }

    return _startOfDay(start);
  }

  /// Calculate the previous date before the given date based on settings
  Future<DateTime> calculatePreviousDate(DateTime asOfDate) async {
    final settings = await _settingsRepository.get('userSettings');
    if (settings == UserSettings.empty) {
      throw Exception('User settings not found');
    }

    if (settings.intervalType == DateIntervalType.oneTime ||
        _compareAsc(asOfDate, settings.effectiveDate) != 1) {
      return _startOfDay(settings.effectiveDate);
    }

    DateTime start = _startOfDay(settings.effectiveDate);
    int count = 0;

    while (_compareAsc(start, asOfDate) == -1) {
      count++;
      start = await _nextRecurrence(count);
    }

    return _nextRecurrence(count - 1);
  }

  /// Calculate the next recurrence date based on settings
  Future<DateTime> _nextRecurrence(int amount) async {
    final settings = await _settingsRepository.get('userSettings');
    if (settings == UserSettings.empty) {
      throw Exception('User settings not found');
    }

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

  // Helper methods remain synchronous since they don't need settings
  int _compareAsc(DateTime date1, DateTime date2) {
    final d1 = _startOfDay(date1);
    final d2 = _startOfDay(date2);

    if (d1.isBefore(d2)) return -1;
    if (d1.isAfter(d2)) return 1;
    return 0;
  }

  DateTime _startOfDay(DateTime date) {
    return DateTime(date.year, date.month, date.day);
  }

  DateTime _addDays(DateTime date, int days) {
    return date.add(Duration(days: days));
  }

  DateTime _addWeeks(DateTime date, int weeks) {
    return date.add(Duration(days: weeks * 7));
  }

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

  DateTime _addYears(DateTime date, int years) {
    return DateTime(date.year + years, date.month, date.day);
  }
}
