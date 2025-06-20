import 'dart:developer' as developer;

import 'package:flutter/widgets.dart';

import '../services/notification_service.dart';
import 'base_form_state.dart';

abstract class BaseViewModel<T extends BaseFormState> extends ChangeNotifier {
  late T _formState;
  final NotificationService _notificationService;

  BaseViewModel({
    required T formState,
    required NotificationService notificationService,
  }) : _formState = formState,
       _notificationService = notificationService;

  NotificationService get notificationService => _notificationService;

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
  Future<void> handleAsync(
    Future<void> Function() operation, {
    bool showErrorNotification = true,
  }) async {
    try {
      updateState(
        (state) =>
            state.copyWith(state: ViewFormState.loading, errorMessage: null)
                as T,
      );

      await operation();

      updateState((state) => state.copyWith(state: ViewFormState.ready) as T);
    } catch (e) {
      developer.log('Error occurred', name: 'BaseViewModel', error: e);
      updateState(
        (state) =>
            state.copyWith(
                  state: ViewFormState.error,
                  errorMessage: e.toString(),
                )
                as T,
      );

      if (showErrorNotification) {
        await _notificationService.showNotification(
          e.toString(),
          isError: true,
        );
      }
    }
  }

  @protected
  Future<void> showNotification(String message, {bool isError = false}) async {
    await _notificationService.showNotification(message, isError: isError);
  }

  @protected
  void setFormError(String message) {
    updateState(
      (state) =>
          state.copyWith(state: ViewFormState.error, errorMessage: message)
              as T,
    );
  }

  void resetState() {
    updateState(
      (state) =>
          state.copyWith(state: ViewFormState.initial, errorMessage: null) as T,
    );
  }
}
