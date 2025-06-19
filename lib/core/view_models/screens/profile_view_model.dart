import 'dart:async';

import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/utils/utils.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';
import 'profile_form_state.dart';

class ProfileViewModel extends BaseViewModel<ProfileFormState> {
  final AuthenticationClient _authenticationClient;
  final AccountRepository _accountRepository;
  final CategoryRepository _categoryRepository;
  final TagRepository _tagRepository;
  final TransactionRepository _transactionRepository;
  final UpcomingRepository _upcomingRepository;
  final UserSettingsRepository _userSettingsRepository;
  final _navigationController = StreamController<String>();

  late final StreamSubscription<AuthenticationStatus> _statusSubscription;

  ProfileViewModel({
    required AuthenticationClient authenticationClient,
    required AccountRepository accountRepository,
    required CategoryRepository categoryRepository,
    required TagRepository tagRepository,
    required TransactionRepository transactionRepository,
    required UpcomingRepository upcomingRepository,
    required UserSettingsRepository userSettingsRepository,
    required super.notificationService,
  }) : _authenticationClient = authenticationClient,
       _accountRepository = accountRepository,
       _categoryRepository = categoryRepository,
       _tagRepository = tagRepository,
       _transactionRepository = transactionRepository,
       _upcomingRepository = upcomingRepository,
       _userSettingsRepository = userSettingsRepository,
       super(formState: ProfileFormState()) {
    _initializeState();
  }

  Stream<String> get navigationStream => _navigationController.stream;

  String get fallbackPictureUrl => 'assets/images/default_profile.png';

  void _initializeState() {
    // Set initial state based on current authentication status
    final currentStatus = _authenticationClient.currentStatus;
    if (currentStatus == AuthenticationStatus.authenticated) {
      final user = _authenticationClient.credentials.user;
      updateState(
        (s) => s.copyWith(
          state: ViewFormState.ready,
          name: user.name ?? '',
          pictureUrl: (user.pictureUrl.toString() as String?) ?? '',
          tokenExpiresAt: _authenticationClient.credentials.expiresAt,
          tokenType: _authenticationClient.credentials.tokenType,
        ),
      );
    }

    // Listen to future authentication status changes
    _statusSubscription = _authenticationClient.statusStream.listen((status) {
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
  }

  @override
  void dispose() {
    _statusSubscription.cancel();
    _navigationController.close();
    super.dispose();
  }

  Future<void> logout() async {
    await handleAsync(() async {
      await _authenticationClient.logout();
    });
  }

  Future<void> clearData() async {
    await handleAsync(() async {
      await _accountRepository.clearData();
      await _categoryRepository.clearData();
      await _tagRepository.clearData();
      await _transactionRepository.clearData();
      await _upcomingRepository.clearData();
      await _userSettingsRepository.clearData();
    });
  }

  void fallbackToDefaultPicture() {
    updateState((s) => s.copyWith(pictureUrl: ''));
  }

  void _handleUnauthenticated() {
    if (!formState.isEmpty) {
      updateState(
        (s) =>
            s.copyWith(state: ViewFormState.initial, name: '', pictureUrl: ''),
      );
      _navigationController.add('/login');
    }
  }

  void _handleAuthenticated() {
    final user = _authenticationClient.credentials.user;
    final credentials = _authenticationClient.credentials;
    if (formState.isEmpty || formState.name != user.name) {
      updateState(
        (s) => s.copyWith(
          state: ViewFormState.ready,
          name: user.name ?? '',
          pictureUrl: (user.pictureUrl.toString() as String?) ?? '',
          tokenExpiresAt: credentials.expiresAt,
          tokenType: credentials.tokenType,
        ),
      );
    }
  }

  void _handleError() {
    final errorMsg = _authenticationClient.errorMessage ?? 'Unknown error';
    setFormError(errorMsg);
    showNotification(errorMsg, isError: true);
  }

  void _handleLoading() {
    if (formState.state != ViewFormState.loading) {
      updateState(
        (s) => s.copyWith(state: ViewFormState.loading, errorMessage: null),
      );
    }
  }

  String formatTimeRemaining(DateTime? dateTime) {
    if (dateTime == null) return 'N/A';
    final now = DateTime.now();
    if (dateTime.isBefore(now)) return 'Expired';

    final difference = dateTime.difference(now);
    if (difference.inDays > 0) {
      return '${difference.inDays}d ${difference.inHours % 24}h';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ${difference.inMinutes % 60}m';
    } else {
      return '${difference.inMinutes}m';
    }
  }
}
