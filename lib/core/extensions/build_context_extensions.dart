import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/app.dart';

extension NavigationExtensions on BuildContext {
  /// Pops the current route if possible, otherwise navigates to the home route.
  /// This is useful for handling navigation in scenarios where you want to go back
  /// or return to home if there's nowhere to go back to.
  ///
  /// Note: When using this after an async operation, make sure to check if the widget
  /// is still mounted before calling this method.
  void popOrGoHome() {
    if (canPop()) {
      pop();
    } else {
      go(kTrueHome);
    }
  }
}
