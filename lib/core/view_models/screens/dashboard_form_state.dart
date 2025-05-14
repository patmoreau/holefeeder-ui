import 'package:holefeeder/core/view_models/base_form_state.dart';

import 'account_view_model.dart';

class DashboardFormState extends BaseFormState {
  final List<AccountViewModel> accounts;
  final bool isRefreshing;

  const DashboardFormState({
    this.accounts = const [],
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  DashboardFormState copyWith({
    List<AccountViewModel>? accounts,
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
