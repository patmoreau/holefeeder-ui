import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';

class AccountViewModel extends BaseViewModel<AccountFormState> {
  final UpcomingRepository _upcomingRepository;

  String get name => formState.account.name;
  Account get account => formState.account;
  bool get isRefreshing => formState.isRefreshing;
  int get upcomingCashflowsCount => formState.upcoming.length;
  bool get isFavorite => formState.account.favorite;

  AccountViewModel({
    required Account account,
    required UpcomingRepository upcomingRepository,
    NotificationService? notificationService,
  }) : _upcomingRepository = upcomingRepository,
       super(AccountFormState(account: account), notificationService) {
    loadData();
  }

  Future<void> loadData() async {
    await handleAsync(() async {
      final upcoming = await _upcomingRepository.getForAccount(
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
