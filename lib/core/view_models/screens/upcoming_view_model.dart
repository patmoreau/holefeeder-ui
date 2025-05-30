import 'dart:async';

import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';
import 'upcoming_form_state.dart';

class UpcomingViewModel extends BaseViewModel<UpcomingFormState> {
  final UpcomingRepository _repository;

  UpcomingViewModel({
    required Upcoming upcoming,
    required UpcomingRepository repository,
    required super.notificationService,
  }) : _repository = repository,
       super(formState: UpcomingFormState(upcoming: upcoming)) {
    loadData();
  }

  String get description =>
      formState.upcoming.description.isNotEmpty
          ? formState.upcoming.description
          : formState.upcoming.category.name;

  DateTime get date => formState.upcoming.date;

  Decimal get amount => formState.upcoming.amount;

  Future<void> loadData() async {
    await handleAsync(() async {
      final upcoming = await _repository.get(
        _repository.createUpcomingKey(formState.upcoming),
      );
      updateState(
        (s) => s.copyWith(upcoming: upcoming, state: ViewFormState.ready),
      );
    });
  }

  Future<void> pay() async {
    await handleAsync(() async {
      await _repository.save(formState.upcoming.id, formState.upcoming);
      updateState((s) => s.copyWith(state: ViewFormState.ready));
    });
  }
}
