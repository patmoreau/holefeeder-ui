import '../models/models.dart';

abstract class PeriodService {
  Future<DateInterval> getCurrentPeriod();

  Future<DateInterval> calculatePeriod(DateTime asOfDate);

  Future<DateTime> calculateNextDate(DateTime asOfDate);

  Future<DateTime> calculatePreviousDate(DateTime asOfDate);
}
