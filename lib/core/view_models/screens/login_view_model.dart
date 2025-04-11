import 'dart:async';

import 'package:holefeeder/core/enums/authentication_status_enum.dart';
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

  LoginViewModel({required AuthenticationClient authenticationProvider})
    : _authenticationProvider = authenticationProvider,
      super(const SimpleFormState()) {
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
        } else if (status == AuthenticationStatus.error) {
          updateState(
            (s) => s.copyWith(
              state: ViewFormState.error,
              errorMessage:
                  "Failed to login: ${_authenticationProvider.errorMessage}",
            ),
          );
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
      updateState((s) => s.copyWith(state: ViewFormState.ready));
      _navigationController.add('/');
    });
  }
}
