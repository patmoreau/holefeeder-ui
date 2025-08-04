import 'dart:developer' as developer;

import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/services/pending_actions_service.dart';
import 'package:quick_actions/quick_actions.dart';
import 'package:universal_platform/universal_platform.dart';

import '../authentication/authentication_client.dart';
import 'quick_actions_service.dart';

class QuickActionsServiceImpl implements QuickActionsService {
  static const kActionPurchase = 'action_purchase';
  static const kActionProfile = 'action_profile';
  static const kActionSettings = 'action_settings';
  static const kActionDashboard = 'action_dashboard';

  final AuthenticationClient _authenticationClient;
  final PendingActionsService _pendingActionsService;
  final QuickActions _quickActions = QuickActions();
  late GoRouter _router;

  QuickActionsServiceImpl(
    this._authenticationClient,
    this._pendingActionsService,
  );

  @override
  void initialize(GoRouter router) {
    _router = router;

    developer.log(
      'Initializing QuickActionsService with router: $_router',
      name: 'QuickActionsService',
    );

    if (!UniversalPlatform.isMobile) {
      developer.log(
        'Quick actions are only supported on mobile platforms.',
        name: 'QuickActionsService',
      );
      return;
    }

    // Set up quick actions
    _quickActions.setShortcutItems([
      ShortcutItem(
        type: kActionPurchase,
        localizedTitle: 'New Purchase',
        icon: 'purchase_icon',
      ),
      ShortcutItem(
        type: kActionProfile,
        localizedTitle: 'View Profile',
        icon: 'contact',
      ),
      ShortcutItem(
        type: kActionSettings,
        localizedTitle: 'Settings',
        icon: 'confirmation',
      ),
      ShortcutItem(
        type: kActionDashboard,
        localizedTitle: 'Dashboard',
        icon: 'home',
      ),
    ]);

    _quickActions.initialize((shortcutType) {
      developer.log(
        'Quick action launched: $shortcutType',
        name: 'QuickActionsService',
      );
      _handleQuickAction(shortcutType);
    });
  }

  @override
  Future<void> handlePendingAction() async {
    String? pendingAction = await _pendingActionsService.getPendingAction();

    if (pendingAction != null) {
      await _pendingActionsService.clearPendingAction();

      _handleAction(pendingAction);
    } else {
      _router.go('/dashboard');
    }
  }

  Future<void> _handleQuickAction(String shortcutType) async {
    bool isAuthenticated = _authenticationClient.isAuthenticated;

    if (!isAuthenticated) {
      developer.log(
        'User is not authenticated, redirecting to login for action: $shortcutType',
        name: 'QuickActionsService',
      );
      await _pendingActionsService.setPendingAction(shortcutType);
      _router.go('/login');
      return;
    }

    _handleAction(shortcutType);
  }

  Future<void> _handleAction(String shortcutType) async {
    developer.log(
      'Handling action for shortcut type: $shortcutType',
      name: 'QuickActionsService',
    );
    switch (shortcutType) {
      case kActionPurchase:
        _router.go('/purchase');
        break;
      case kActionProfile:
        _router.go('/profile');
        break;
      case kActionSettings:
        _router.go('/settings');
        break;
      case kActionDashboard:
      default:
        _router.go('/dashboard');
    }
  }
}
