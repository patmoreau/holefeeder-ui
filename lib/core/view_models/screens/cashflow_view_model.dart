import 'dart:async';
import 'dart:developer' as developer;

import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

import '../../events/events.dart';
import '../base_form_state.dart';
import '../base_view_model.dart';
import 'cashflow_form_state.dart';

class CashflowViewModel extends BaseViewModel<CashflowFormState> {
  final CashflowRepository _repository;
  late final StreamSubscription _subscription;

  CashflowViewModel({
    required Cashflow cashflow,
    required CashflowRepository repository,
    required super.notificationService,
  }) : _repository = repository,
       super(formState: CashflowFormState(cashflow: cashflow)) {
    _subscription = EventBus()
        .on<CashflowChangedEvent>()
        .where((event) => event.id == cashflow.id)
        .listen((event) {
          unawaited(_handleRefreshed(event));
        });
    loadData();
  }

  String get id => formState.cashflow.id;

  String get description =>
      formState.cashflow.description.isNotEmpty
          ? formState.cashflow.description
          : formState.cashflow.category.name;

  DateTime get date => formState.cashflow.effectiveDate;

  Decimal get amount => formState.cashflow.amount;

  Future<void> _handleRefreshed(CashflowChangedEvent event) async {
    developer.log(
      'Cashflows refreshed, updating view',
      name: 'CashflowViewModel',
    );
    updateState((s) => s.copyWith(isRefreshing: true));
    await loadData();
    updateState((s) => s.copyWith(isRefreshing: false));
  }

  Future<void> loadData() async {
    await handleAsync(() async {
      final cashflow = await _repository.get(formState.cashflow.id);
      updateState(
        (s) => s.copyWith(cashflow: cashflow, state: ViewFormState.ready),
      );
    });
  }

  Future<void> delete() async {
    await handleAsync(() async {
      await _repository.delete(formState.cashflow);
      updateState((s) => s.copyWith(state: ViewFormState.ready));
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
