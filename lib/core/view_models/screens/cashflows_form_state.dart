import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class CashflowsFormState extends BaseFormState {
  final List<Cashflow> cashflows;
  final bool showInactive;
  final bool isRefreshing;

  const CashflowsFormState({
    this.cashflows = const [],
    this.showInactive = false,
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  CashflowsFormState copyWith({
    List<Cashflow>? cashflows,
    bool? showInactive,
    bool? isRefreshing,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return CashflowsFormState(
      cashflows: cashflows ?? this.cashflows,
      showInactive: showInactive ?? this.showInactive,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
