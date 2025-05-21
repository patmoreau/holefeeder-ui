import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';

class DashboardViewModel extends BaseViewModel<DashboardFormState> {
  final AccountRepository _accountRepository;
  final UpcomingRepository _upcomingRepository;
  final NotificationService _notificationService;

  List<AccountViewModel> get accounts => formState.accounts;

  bool get isRefreshing => formState.isRefreshing;

  DashboardViewModel({
    required DataProvider dataProvider,
    required AccountRepository accountRepository,
    required UpcomingRepository upcomingRepository,
    required NotificationService notificationService,
  }) : _accountRepository = accountRepository,
       _upcomingRepository = upcomingRepository,
       _notificationService = notificationService,
       super(const DashboardFormState(), notificationService) {
    loadDashboardData();
  }

  Future<void> loadDashboardData() async {
    await handleAsync(() async {
      final accounts = await _accountRepository.getAll();

      updateState(
        (s) => s.copyWith(
          accounts: accounts.map(toViewModel).toList(),
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

  AccountViewModel toViewModel(Account account) {
    return AccountViewModel(
      account: account,
      upcomingRepository: _upcomingRepository,
      notificationService: _notificationService,
    );
  }
}
