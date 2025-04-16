import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/ui/services/notification_service.dart';

class NotificationServiceScope extends StatelessWidget {
  final Widget child;

  const NotificationServiceScope({super.key, required this.child});

  @override
  Widget build(BuildContext context) => child;
}

class NotificationServiceProvider extends InheritedWidget {
  final GlobalKey<NavigatorState> navigatorKey;

  const NotificationServiceProvider({
    super.key,
    required this.navigatorKey,
    required super.child,
  });

  static NotificationService of(BuildContext context) {
    final provider =
        context
            .dependOnInheritedWidgetOfExactType<NotificationServiceProvider>();
    if (provider == null) {
      throw Exception('NotificationServiceProvider not found in context');
    }
    return NotificationServiceImpl(
      context,
      navigatorKey: provider.navigatorKey,
    );
  }

  @override
  bool updateShouldNotify(NotificationServiceProvider oldWidget) => false;
}
