import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:universal_platform/universal_platform.dart';
import 'package:holefeeder/core/constants/themes.dart';

class ErrorAction {
  final String label;
  final VoidCallback onPressed;

  const ErrorAction({required this.label, required this.onPressed});
}

class ErrorDialog extends StatelessWidget {
  final String message;
  final List<ErrorAction> actions;
  final Duration autoDismiss;

  const ErrorDialog({
    super.key,
    this.message = '',
    this.actions = const [],
    this.autoDismiss = Duration.zero,
  });

  @override
  Widget build(BuildContext context) {
    _triggerHapticFeedback();
    _setupAutoDismiss(context);

    return UniversalPlatform.isApple
        ? _buildCupertinoDialog(context)
        : _buildMaterialDialog(context);
  }

  void _triggerHapticFeedback() {
    HapticFeedback.mediumImpact();
  }

  void _setupAutoDismiss(BuildContext context) {
    if (autoDismiss > Duration.zero && actions.isEmpty) {
      Future.delayed(autoDismiss, () {
        var router = GoRouter.of(context);
        if (router.canPop()) {
          router.pop();
        }
      });
    }
  }

  Widget _buildCupertinoDialog(BuildContext context) {
    final theme =
        Theme.of(context).extension<ErrorDialogTheme>() ??
        const ErrorDialogTheme();

    return CupertinoAlertDialog(
      title: Row(
        children: [
          Icon(
            CupertinoIcons.exclamationmark_triangle_fill,
            color: theme.iconColor,
            size: 20,
            semanticLabel: 'Error icon',
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text('Error', style: TextStyle(color: theme.textColor)),
          ),
        ],
      ),
      content: Text(message, style: TextStyle(color: theme.textColor)),
      actions:
          actions.isEmpty && autoDismiss > Duration.zero
              ? []
              : actions.isEmpty
              ? [
                CupertinoDialogAction(
                  onPressed: () {
                    final router = GoRouter.of(context);
                    if (router.canPop()) {
                      router.pop();
                    }
                  },
                  child: const Text('OK'),
                ),
              ]
              : actions
                  .map(
                    (action) => CupertinoDialogAction(
                      onPressed: action.onPressed,
                      child: Text(action.label),
                    ),
                  )
                  .toList(),
    );
  }

  Widget _buildMaterialDialog(BuildContext context) {
    final theme =
        Theme.of(context).extension<ErrorDialogTheme>() ??
        const ErrorDialogTheme();

    return AlertDialog(
      icon: Icon(
        Icons.error_outline,
        color: theme.iconColor,
        semanticLabel: 'Error icon',
      ),
      title: const Text('Error'),
      content: Text(message),
      actions:
          actions.isEmpty && autoDismiss > Duration.zero
              ? []
              : actions.isEmpty
              ? [
                TextButton(
                  onPressed: () {
                    final router = GoRouter.of(context);
                    if (router.canPop()) {
                      router.pop();
                    }
                  },
                  child: const Text('OK'),
                ),
              ]
              : actions
                  .map(
                    (action) => TextButton(
                      onPressed: action.onPressed,
                      child: Text(action.label),
                    ),
                  )
                  .toList(),
    );
  }
}
