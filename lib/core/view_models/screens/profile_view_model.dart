import 'dart:async';
import 'package:holefeeder/core/enums/authentication_status_enum.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

class ProfileFormState extends BaseFormState {
  final String name;
  final String pictureUrl;

  ProfileFormState({
    this.name = '',
    this.pictureUrl = '',
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  ProfileFormState copyWith({
    String? name,
    String? pictureUrl,
    ViewFormState? state,
    String? errorMessage,
  }) => ProfileFormState(
    name: name ?? this.name,
    pictureUrl: pictureUrl ?? this.pictureUrl,
    state: state ?? this.state,
    errorMessage: errorMessage ?? this.errorMessage,
  );

  bool get isEmpty => name.isEmpty && pictureUrl.isEmpty;
}

class ProfileViewModel extends BaseViewModel<ProfileFormState> {
  final AuthenticationClient _authenticationProvider;
  final _navigationController = StreamController<String>();
  Stream<String> get navigationStream => _navigationController.stream;

  late final StreamSubscription<AuthenticationStatus> _statusSubscription;

  ProfileViewModel({
    required AuthenticationClient authenticationProvider,
    NotificationService? notificationService,
  }) : _authenticationProvider = authenticationProvider,
       super(ProfileFormState(), notificationService) {
    _initializeState();
  }

  String get screenTitle => 'Profile';
  String get logoutTitle => 'Logout';
  String get fallbackPictureUrl => 'images/default_profile.png';

  void _initializeState() {
    // Set initial state based on current authentication status
    final currentStatus = _authenticationProvider.currentStatus;
    if (currentStatus == AuthenticationStatus.authenticated) {
      final user = _authenticationProvider.credentials.user;
      updateState(
        (s) => s.copyWith(
          state: ViewFormState.ready,
          name: user.name ?? '',
          pictureUrl: (user.pictureUrl.toString() as String?) ?? '',
        ),
      );
    }

    // Listen to future authentication status changes
    _statusSubscription = _authenticationProvider.statusStream.listen((status) {
      switch (status) {
        case AuthenticationStatus.unauthenticated:
          if (!formState.isEmpty) {
            updateState(
              (s) => s.copyWith(
                state: ViewFormState.initial,
                name: '',
                pictureUrl: '',
              ),
            );
          }
          break;
        case AuthenticationStatus.authenticated:
          final user = _authenticationProvider.credentials.user;
          if (formState.isEmpty || formState.name != user.name) {
            updateState(
              (s) => s.copyWith(
                state: ViewFormState.ready,
                name: user.name ?? '',
                pictureUrl: (user.pictureUrl.toString() as String?) ?? '',
              ),
            );
          }
          break;
        case AuthenticationStatus.error:
          final errorMsg =
              _authenticationProvider.errorMessage ?? 'Unknown error';
          setFormError(errorMsg);
          showNotification(errorMsg, isError: true);
          break;
        case AuthenticationStatus.loading:
          if (formState.state != ViewFormState.loading) {
            updateState(
              (s) =>
                  s.copyWith(state: ViewFormState.loading, errorMessage: null),
            );
          }
          break;
      }
    });
  }

  @override
  void dispose() {
    _statusSubscription.cancel();
    _navigationController.close();
    super.dispose();
  }

  Future<void> logout() async {
    await handleAsync(() async {
      await _authenticationProvider.logout();
      _navigationController.add('/login');
      await showNotification('Successfully logged out');
    });
  }

  void fallbackToDefaultPicture() {
    updateState((s) => s.copyWith(pictureUrl: ''));
  }
}
