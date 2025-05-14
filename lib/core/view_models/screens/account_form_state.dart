import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/upcoming.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class AccountFormState extends BaseFormState {
  final Account account;
  final List<Upcoming> upcoming;
  final bool isRefreshing;

  const AccountFormState({
    required this.account,
    this.upcoming = const [],
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  AccountFormState copyWith({
    Account? account,
    List<Upcoming>? upcoming,
    bool? isRefreshing,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return AccountFormState(
      account: account ?? this.account,
      upcoming: upcoming ?? this.upcoming,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
