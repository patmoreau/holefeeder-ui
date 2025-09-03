import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class CashflowFormState extends BaseFormState {
  final Cashflow cashflow;
  final bool isRefreshing;

  const CashflowFormState({
    required this.cashflow,
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  CashflowFormState copyWith({
    Cashflow? cashflow,
    bool? isRefreshing,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return CashflowFormState(
      cashflow: cashflow ?? this.cashflow,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
