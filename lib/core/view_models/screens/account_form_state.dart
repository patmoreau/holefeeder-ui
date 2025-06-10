import 'package:holefeeder/core/models/models.dart';

import '../base_form_state.dart';

enum ListType { upcoming, transactions }

class AccountFormState extends BaseFormState {
  final Account account;
  final List<Upcoming> upcoming;
  final List<Transaction> transactions;
  final bool isRefreshing;
  final ListType selectedSegment;

  const AccountFormState({
    required this.account,
    this.upcoming = const [],
    this.transactions = const [],
    this.isRefreshing = false,
    this.selectedSegment = ListType.upcoming,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  AccountFormState copyWith({
    Account? account,
    List<Upcoming>? upcoming,
    List<Transaction>? transactions,
    bool? isRefreshing,
    ListType? selectedSegment,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return AccountFormState(
      account: account ?? this.account,
      upcoming: upcoming ?? this.upcoming,
      transactions: transactions ?? this.transactions,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      selectedSegment: selectedSegment ?? this.selectedSegment,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
