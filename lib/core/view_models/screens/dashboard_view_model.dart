import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';
import 'package:holefeeder/core/view_models/screens/dashboard_form_state.dart';
import 'package:holefeeder/core/view_models/user_settings_view_model.dart';

import 'account_view_model.dart';

class DashboardViewModel extends BaseViewModel<DashboardFormState> {
  final UserSettingsViewModel _userSettingsViewModel;
  final DataProvider _dataProvider;

  List<AccountViewModel> get accounts => formState.accounts;

  bool get isRefreshing => formState.isRefreshing;

  DashboardViewModel({
    required DataProvider dataProvider,
    required UserSettingsViewModel userSettingsViewModel,
    NotificationService? notificationService,
  }) : _userSettingsViewModel = userSettingsViewModel,
       _dataProvider = dataProvider,
       super(const DashboardFormState(), notificationService) {
    loadDashboardData();
  }

  Future<void> loadDashboardData() async {
    await handleAsync(() async {
      final accounts = await _dataProvider.getAccounts();
      updateState(
        (s) => s.copyWith(
          accounts: accounts.map(toElement).toList(),
          state: ViewFormState.ready,
        ),
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

  AccountViewModel toElement(Account account) {
    return AccountViewModel(
      account: account,
      userSettingsViewModel: _userSettingsViewModel,
      dataProvider: _dataProvider,
    );
  }
}
