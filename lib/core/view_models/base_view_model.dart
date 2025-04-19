import 'package:flutter/widgets.dart';

import '../services/notification_service.dart';
import 'base_form_state.dart';

abstract class BaseViewModel<T extends BaseFormState> extends ChangeNotifier {
  T _formState;
  final NotificationService? _notificationService;

  BaseViewModel(this._formState, [this._notificationService]);

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
  Future<void> handleAsync(Future<void> Function() operation, {bool showErrorNotification = true}) async {
    try {
      updateState((state) => state.copyWith(state: ViewFormState.loading, errorMessage: null) as T);

      await operation();

      updateState((state) => state.copyWith(state: ViewFormState.ready) as T);
    } catch (e) {
      // Always update form state
      updateState((state) => state.copyWith(state: ViewFormState.error, errorMessage: e.toString()) as T);

      // Optionally show notification
      if (showErrorNotification && _notificationService != null) {
        await _notificationService.showNotification(e.toString(), isError: true);
      }
    }
  }

  @protected
  Future<void> showNotification(String message, {bool isError = false}) async {
    if (_notificationService != null) {
      await _notificationService.showNotification(message, isError: isError);
    }
  }

  @protected
  void setFormError(String message) {
    updateState((state) => state.copyWith(state: ViewFormState.error, errorMessage: message) as T);
  }

  void resetState() {
    updateState((state) => state.copyWith(state: ViewFormState.initial, errorMessage: null) as T);
  }
}
