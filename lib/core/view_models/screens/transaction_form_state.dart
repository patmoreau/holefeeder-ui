import 'package:holefeeder/core/models/models.dart';

import '../base_form_state.dart';

class TransactionFormState extends BaseFormState {
  final Transaction transaction;
  final bool isRefreshing;

  const TransactionFormState({
    required this.transaction,
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  TransactionFormState copyWith({
    Transaction? transaction,
    bool? isRefreshing,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return TransactionFormState(
      transaction: transaction ?? this.transaction,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
