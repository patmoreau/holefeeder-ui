import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

class DashboardFormState extends BaseFormState {
  final List<Account> accounts;
  final bool isRefreshing;

  const DashboardFormState({
    this.accounts = const [],
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  DashboardFormState copyWith({
    List<Account>? accounts,
    bool? isRefreshing,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return DashboardFormState(
      accounts: accounts ?? this.accounts,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class DashboardViewModel extends BaseViewModel<DashboardFormState> {
  final DataProvider _dataProvider;

  List<Account> get accounts => formState.accounts;
  bool get isRefreshing => formState.isRefreshing;

  DashboardViewModel({
    required DataProvider dataProvider,
    NotificationService? notificationService,
  }) : _dataProvider = dataProvider,
       super(const DashboardFormState(), notificationService) {
    loadDashboardData();
  }

  Future<void> loadDashboardData() async {
    await handleAsync(() async {
      final accounts = await _dataProvider.getAccounts();
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
      await showNotification('Dashboard refreshed successfully');
      updateState((s) => s.copyWith(isRefreshing: false));
    });
  }
}
