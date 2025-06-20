import 'dart:async';

import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/utils/utils.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';

class LoginViewModel extends BaseViewModel<SimpleFormState> {
  final AuthenticationClient _authenticationProvider;
  final _navigationController = StreamController<String>();
  late StreamSubscription<AuthenticationStatus> _statusSubscription;

  LoginViewModel({
    required AuthenticationClient authenticationProvider,
    required super.notificationService,
  }) : _authenticationProvider = authenticationProvider,
       super(formState: const SimpleFormState()) {
    loadInitialData();
  }

  Stream<String> get navigationStream => _navigationController.stream;

  Future<void> loadInitialData() async {
    await handleAsync(() async {
      _statusSubscription = _authenticationProvider.statusStream.listen((
        status,
      ) {
        switch (status) {
          case AuthenticationStatus.unauthenticated:
            _handleUnauthenticated();
            break;
          case AuthenticationStatus.authenticated:
            _handleAuthenticated();
            break;
          case AuthenticationStatus.error:
            _handleError();
            break;
          case AuthenticationStatus.loading:
            _handleLoading();
            break;
        }
      });
    });
  }

  @override
  void dispose() {
    _statusSubscription.cancel();
    _navigationController.close();
    super.dispose();
  }

  Future<void> login() async {
    await handleAsync(() async {
      await _authenticationProvider.login();
    });
  }

  void _handleUnauthenticated() {
    updateState((s) => s.copyWith(state: ViewFormState.initial));
  }

  void _handleAuthenticated() {
    updateState((s) => s.copyWith(state: ViewFormState.ready));
    _navigationController.add('/');
  }

  void _handleError() {
    final errorMsg = "Failed to login: ${_authenticationProvider.errorMessage}";
    setFormError(errorMsg);
    showNotification(errorMsg, isError: true);
  }

  void _handleLoading() {
    updateState((s) => s.copyWith(state: ViewFormState.loading));
  }
}
