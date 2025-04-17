import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:universal_platform/universal_platform.dart';
import '../../core/services/notification_service.dart';

class NotificationServiceImpl implements NotificationService {
  final BuildContext context;

  NotificationServiceImpl(this.context);

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
    await showCupertinoDialog(
      context: context,
      builder:
          (dialogContext) => CupertinoAlertDialog(
            title: Text(isError ? 'Error' : 'Success'),
            content: Text(message),
            actions: [
              CupertinoDialogAction(
                child: const Text('OK'),
                onPressed: () {
                  final router = GoRouter.of(dialogContext);
                  if (router.canPop()) {
                    router.pop();
                  }
                },
              ),
            ],
          ),
    );
  }

  Future<void> _showMaterialNotification(String message) async {
    await ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message))).closed;
  }
}
