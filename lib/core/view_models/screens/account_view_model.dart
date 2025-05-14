import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/account_type_enum.dart';
import 'package:holefeeder/core/enums/category_type_enum.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';
import 'package:holefeeder/core/view_models/screens/account_form_state.dart';
import 'package:holefeeder/core/view_models/user_settings_view_model.dart';

class AccountViewModel extends BaseViewModel<AccountFormState> {
  final UserSettingsViewModel _userSettingsViewModel;
  final DataProvider _dataProvider;

  Account get account => formState.account;
  bool get isRefreshing => formState.isRefreshing;
  int get upcomingCashflowsCount => formState.upcoming.length;
  bool get isFavorite => formState.account.favorite;

  AccountViewModel({
    required Account account,
    required UserSettingsViewModel userSettingsViewModel,
    required DataProvider dataProvider,
    NotificationService? notificationService,
  }) : _userSettingsViewModel = userSettingsViewModel,
       _dataProvider = dataProvider,
       super(AccountFormState(account: account), notificationService) {
    loadData();
  }

  Future<void> loadData() async {
    await handleAsync(() async {
      final upcoming = await _dataProvider.getUpcomingCashflows(
        _userSettingsViewModel.currentPeriod.start,
        _userSettingsViewModel.currentPeriod.end,
        formState.account.id,
      );
      updateState(
        (s) => s.copyWith(upcoming: upcoming, state: ViewFormState.ready),
      );
    });
  }

  Future<void> refreshAccount() async {
    if (isRefreshing) return;

    await handleAsync(() async {
      updateState((s) => s.copyWith(isRefreshing: true));
      await loadData();
      await showNotification('Dashboard refreshed successfully');
      updateState((s) => s.copyWith(isRefreshing: false));
    });
  }

  int get projectionType {
    final accountTypeMultiplier = formState.account.type.multiplier;
    if (accountTypeMultiplier == Decimal.fromInt(1)) {
      return projection.compareTo(Decimal.zero);
    }
    return formState.account.balance.compareTo(projection);
  }

  DateTime get lastUpdated => formState.account.updated;

  Decimal get balance => formState.account.balance;

  Decimal get projection {
    final accountTypeMultiplier = formState.account.type.multiplier;
    return formState.account.balance +
        (formState.upcoming.isEmpty
            ? Decimal.zero
            : formState.upcoming
                .map(
                  (e) =>
                      e.amount *
                      accountTypeMultiplier *
                      e.category.type.multiplier,
                )
                .reduce((a, b) => a + b));
  }
}
