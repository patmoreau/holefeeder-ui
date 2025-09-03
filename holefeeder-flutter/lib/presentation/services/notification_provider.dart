import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';

import 'notification_service.dart';

class NotificationServiceScope extends StatelessWidget {
  final Widget child;

  const NotificationServiceScope({super.key, required this.child});

  @override
  Widget build(BuildContext context) => child;
}

class NotificationServiceProvider extends InheritedWidget {
  const NotificationServiceProvider({super.key, required super.child});

  static NotificationService of(BuildContext context, {bool listen = false}) {
    if (listen) {
      final provider =
          context
              .dependOnInheritedWidgetOfExactType<
                NotificationServiceProvider
              >();
      if (provider == null) {
        throw Exception('NotificationServiceProvider not found in context');
      }
    }
    // Always return a new instance without establishing a dependency when listen is false
    return NotificationServiceImpl(context);
  }

  @override
  bool updateShouldNotify(NotificationServiceProvider oldWidget) => false;
}
