import 'package:flutter/widgets.dart';
import 'base_form_state.dart';

abstract class BaseViewModel<T extends BaseFormState> extends ChangeNotifier {
  T _formState;

  BaseViewModel(this._formState);

  T get formState => _formState;
  bool get isLoading => _formState.state == ViewFormState.loading;
  bool get hasError => _formState.state == ViewFormState.error;
  String? get error => _formState.errorMessage;

  @protected
  void updateState(T Function(T) update) {
    _formState = update(_formState);
    notifyListeners();
  }

  @protected
  Future<void> handleAsync(Future<void> Function() operation) async {
    try {
      updateState(
        (state) =>
            state.copyWith(state: ViewFormState.loading, errorMessage: null)
                as T,
      );

      await operation();

      updateState((state) => state.copyWith(state: ViewFormState.ready) as T);
    } catch (e) {
      updateState(
        (state) =>
            state.copyWith(
                  state: ViewFormState.error,
                  errorMessage: e.toString(),
                )
                as T,
      );
    }
  }

  void resetState() {
    updateState(
      (state) =>
          state.copyWith(state: ViewFormState.initial, errorMessage: null) as T,
    );
  }
}
