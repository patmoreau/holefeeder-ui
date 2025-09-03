import 'dart:async';
import 'dart:developer' as developer;

import 'package:holefeeder/core/events.dart';
import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/repositories.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

import 'cashflows_form_state.dart';

class CashflowsViewModel extends BaseViewModel<CashflowsFormState> {
  final CashflowRepository _repository;
  late final StreamSubscription _subscription;

  CashflowsViewModel({
    required CashflowRepository repository,
    required super.notificationService,
  }) : _repository = repository,
       super(formState: CashflowsFormState()) {
    _subscription = EventBus().on<CashflowChangedEvent>().listen((event) {
      unawaited(_handleRefreshed(event));
    });
    unawaited(loadData());
  }

  List<Cashflow> get cashflows =>
      formState.showInactive
          ? formState.cashflows
          : formState.cashflows.where((c) => !c.inactive).toList();

  bool get showInactive => formState.showInactive;

  bool get isRefreshing => formState.isRefreshing;

  Future<void> _handleRefreshed(CashflowChangedEvent event) async {
    developer.log(
      'Cashflows refreshed, updating view',
      name: 'CashflowsViewModel',
    );
    updateState((s) => s.copyWith(isRefreshing: true));
    await loadData();
    updateState((s) => s.copyWith(isRefreshing: false));
  }

  Future<void> loadData() async {
    await handleAsync(() async {
      final cashflows = await _repository.getAll();
      updateState(
        (s) => s.copyWith(cashflows: cashflows, state: ViewFormState.ready),
      );
    });
  }

  Future<void> refreshCashflows() async {
    if (isRefreshing) return;

    await handleAsync(() async {
      updateState((s) => s.copyWith(isRefreshing: true));
      await _repository.refreshAll();
      await loadData();
      updateState((s) => s.copyWith(isRefreshing: false));
    });
  }

  Future<void> setShowInactive(bool value) async {
    await handleAsync(() async {
      updateState((s) => s.copyWith(showInactive: value));
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
