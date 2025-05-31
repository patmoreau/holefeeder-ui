import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';
import 'dashboard_form_state.dart';

class DashboardViewModel extends BaseViewModel<DashboardFormState> {
  final AccountRepository _repository;

  DashboardViewModel({
    required AccountRepository repository,
    required super.notificationService,
  }) : _repository = repository,
       super(formState: const DashboardFormState()) {
    loadDashboardData();
  }

  List<Account> get accounts => formState.accounts;

  bool get isRefreshing => formState.isRefreshing;

  Future<void> loadDashboardData() async {
    await handleAsync(() async {
      final accounts = await _repository.getAll();

      updateState(
        (s) => s.copyWith(accounts: accounts, state: ViewFormState.ready),
      );
    });
  }

  Future<void> refreshDashboard() async {
    if (isRefreshing) return;

    await handleAsync(() async {
      updateState((s) => s.copyWith(isRefreshing: true));
      await loadDashboardData();
      updateState((s) => s.copyWith(isRefreshing: false));
    });
  }
}
