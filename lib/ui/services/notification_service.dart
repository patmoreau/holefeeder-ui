import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/extensions/build_context_extensions.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:universal_platform/universal_platform.dart';
import 'package:holefeeder/holefeeder_app.dart';

class NotificationServiceImpl implements NotificationService {
  final BuildContext? context;

  NotificationServiceImpl([this.context]);

  BuildContext _getContext() {
    // First try to use the navigator key's context if available
    if (HolefeederApp.navigatorKey.currentContext != null) {
      return HolefeederApp.navigatorKey.currentContext!;
    }

    // Fall back to the provided context if available
    if (context != null) {
      return context!;
    }

    // If no context is available, throw an error
    throw FlutterError('No valid context available for showing notifications');
  }

  @override
  Future<void> showNotification(String message, {bool isError = false}) async {
    if (UniversalPlatform.isApple) {
      await _showAppleNotification(message, isError);
    } else {
      await _showMaterialNotification(message);
    }
  }

  @override
  Future<void> showSuccess(String message) => showNotification(message);

  @override
  Future<void> showError(String message) =>
      showNotification(message, isError: true);

  Future<void> _showAppleNotification(String message, bool isError) async {
    final ctx = _getContext();

    await showCupertinoDialog(
      context: ctx,
      builder:
          (dialogContext) => CupertinoAlertDialog(
            title: Text(
              isError
                  ? LocalizationService.current.notificationServiceErrorTitle
                  : LocalizationService.current.notificationServiceSuccessTitle,
            ),
            content: Text(message),
            actions: [
              CupertinoDialogAction(
                child: Text(LocalizationService.current.buttonOk),
                onPressed: () {
                  dialogContext.popOrGoHome();
                },
              ),
            ],
          ),
    );
  }

  Future<void> _showMaterialNotification(String message) async {
    final ctx = _getContext();

    await ScaffoldMessenger.of(
      ctx,
    ).showSnackBar(SnackBar(content: Text(message))).closed;
  }
}
