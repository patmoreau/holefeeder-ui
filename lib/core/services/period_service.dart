import 'dart:developer' as developer;

import 'package:holefeeder/core/models/models.dart';

import 'api_service.dart';

abstract class PeriodService {
  Future<DateInterval> getCurrentPeriod();
}

class PeriodServiceImpl extends PeriodService {
  final ApiService apiService;

  PeriodServiceImpl({required this.apiService}) {}

  @override
  Future<DateInterval> getCurrentPeriod() async {
    final today = DateTime.now();
    try {
      final interval = await apiService.computePeriod(today, 0);

      return interval;
    } catch (e) {
      _logError('compute period from API', e);
      return DateInterval(today, today.add(Duration(days: 30)));
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log('Error when $operation', name: 'PeriodService', error: error);
  }
}
