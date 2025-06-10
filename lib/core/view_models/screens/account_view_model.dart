import 'dart:async';
import 'dart:developer' as developer;

import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

import '../view_models.dart';

class AccountViewModel extends BaseViewModel<AccountFormState> {
  final AccountRepository _accountRepository;
  final UpcomingRepository _upcomingRepository;
  final TransactionRepository _transactionRepository;
  late final StreamSubscription _accountRefreshedSubscription;
  final String accountId;

  AccountViewModel({
    required this.accountId,
    required AccountRepository accountRepository,
    required UpcomingRepository upcomingRepository,
    required TransactionRepository transactionRepository,
    required super.notificationService,
  }) : _accountRepository = accountRepository,
       _upcomingRepository = upcomingRepository,
       _transactionRepository = transactionRepository,
       super(formState: AccountFormState(account: Account.empty)) {
    _accountRefreshedSubscription = EventBus()
        .on<AccountRefreshedEvent>()
        .where((event) => event.accountId == accountId)
        .listen((event) {
          unawaited(_handleAccountRefreshed(event));
        });
    unawaited(loadData());
  }

  Future<void> _handleAccountRefreshed(AccountRefreshedEvent event) async {
    developer.log('AccountViewModel: Account refreshed, updating view');
    updateState((s) => s.copyWith(isRefreshing: true));
    await loadData();
    updateState((s) => s.copyWith(isRefreshing: false));
  }

  String get name => formState.account.name;

  Account get account => formState.account;

  bool get isRefreshing => formState.isRefreshing;

  int get upcomingCashflowsCount => formState.upcoming.length;

  bool get isFavorite => formState.account.favorite;

  List<Upcoming> get upcoming => formState.upcoming;

  List<Transaction> get transactions => formState.transactions;

  ListType get selectedSegment => formState.selectedSegment;

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

  Future<void> loadData() async {
    developer.log('AccountViewModel: loadData() called');
    await handleAsync(() async {
      final account = await _accountRepository.get(accountId);
      final upcoming = await _upcomingRepository.getForAccount(accountId);
      final transactions = await _transactionRepository.getForAccount(
        accountId,
        force: formState.isRefreshing,
      );
      developer.log('AccountViewModel: Got ${upcoming.length} upcoming items');
      updateState((s) {
        developer.log(
          'AccountViewModel: Updating state with new upcoming items',
        );
        return s.copyWith(
          account: account,
          upcoming: upcoming,
          transactions: transactions,
          state: ViewFormState.ready,
        );
      });
      developer.log('AccountViewModel: State updated');
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

  Future<void> setSegment(ListType segment) async {
    if (formState.selectedSegment == segment) return;

    updateState((s) => s.copyWith(selectedSegment: segment));
  }

  @override
  void dispose() {
    _accountRefreshedSubscription.cancel();
    super.dispose();
  }
}
