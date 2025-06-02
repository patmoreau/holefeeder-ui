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
      final upcoming = await _repository.get(formState.upcoming.key);
      updateState(
        (s) => s.copyWith(upcoming: upcoming, state: ViewFormState.ready),
      );
    });
  }

  Future<void> pay() async {
    await handleAsync(() async {
      await _repository.save(formState.upcoming);
      updateState((s) => s.copyWith(state: ViewFormState.ready));
    });
  }

  Future<void> cancel() async {
    await handleAsync(() async {
      final upcoming = Upcoming(
        id: formState.upcoming.id,
        date: formState.upcoming.date,
        amount: Decimal.fromInt(0),
        description: formState.upcoming.description,
        tags: formState.upcoming.tags,
        category: formState.upcoming.category,
        account: formState.upcoming.account,
      );
      await _repository.save(upcoming);
      updateState((s) => s.copyWith(state: ViewFormState.ready));
    });
  }

  Future<void> delete() async {
    await handleAsync(() async {
      notificationService.showNotification(
        'Deleting a cashflow is coming soon!',
      );
    });
  }
}
