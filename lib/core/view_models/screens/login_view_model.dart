import 'dart:async';

import 'package:holefeeder/core/enums/authentication_status_enum.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';

class LoginViewModel extends BaseViewModel<SimpleFormState> {
  final AuthenticationClient _authenticationProvider;
  final _navigationController = StreamController<String>();
  late StreamSubscription<AuthenticationStatus> _statusSubscription;

  String get screenTitle => 'Login';
  String get loginTitle => 'Login';
  Stream<String> get navigationStream => _navigationController.stream;

  LoginViewModel({
    required AuthenticationClient authenticationProvider,
    NotificationService? notificationService,
  }) : _authenticationProvider = authenticationProvider,
       super(const SimpleFormState(), notificationService) {
    loadInitialData();
  }

  Future<void> loadInitialData() async {
    await handleAsync(() async {
      _statusSubscription = _authenticationProvider.statusStream.listen((
        status,
      ) {
        if (status == AuthenticationStatus.unauthenticated) {
          updateState((s) => s.copyWith(state: ViewFormState.initial));
        } else if (status == AuthenticationStatus.authenticated) {
          updateState((s) => s.copyWith(state: ViewFormState.ready));
          showNotification('Login successful');
          _navigationController.add('/');
        } else if (status == AuthenticationStatus.error) {
          final errorMsg =
              "Failed to login: ${_authenticationProvider.errorMessage}";
          setFormError(errorMsg);
          showNotification(errorMsg, isError: true);
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
}
