enum ViewFormState { initial, loading, ready, error }

abstract class BaseFormState {
  final ViewFormState state;
  final String? errorMessage;

  const BaseFormState({this.state = ViewFormState.initial, this.errorMessage});

  BaseFormState copyWith({ViewFormState? state, String? errorMessage});
}

// A concrete implementation for simple form states that don't need additional fields
class SimpleFormState extends BaseFormState {
  const SimpleFormState({super.state, super.errorMessage});

  @override
  SimpleFormState copyWith({ViewFormState? state, String? errorMessage}) {
    return SimpleFormState(
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
