import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/app/router.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/platform.dart';

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

    return Platform.isCupertino
        ? _buildCupertinoDialog(context)
        : _buildMaterialDialog(context);
  }

  void _triggerHapticFeedback() {
    HapticFeedback.mediumImpact();
  }

  void _setupAutoDismiss(BuildContext context) {
    if (autoDismiss > Duration.zero && actions.isEmpty) {
      Future.delayed(autoDismiss, () {
        if (context.mounted) {
          if (context.canPop()) {
            context.pop();
          } else {
            context.go(kTrueHome);
          }
        }
      });
    }
  }

  Widget _buildCupertinoDialog(BuildContext context) {
    return CupertinoAlertDialog(
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            CupertinoIcons.exclamationmark_triangle_fill,
            color: AppThemes.getErrorIconColor(context),
            size: 20,
            semanticLabel: 'Error icon',
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              'Error',
              style: AppThemes.getErrorTitleTextStyle(context),
            ),
          ),
        ],
      ),
      content: Text(
        message,
        style: AppThemes.getErrorContentTextStyle(context),
      ),
      actions: _buildDialogActions(context),
    );
  }

  Widget _buildMaterialDialog(BuildContext context) {
    return AlertDialog(
      backgroundColor: AppThemes.getCardColor(context),
      surfaceTintColor: AppThemes.getCardColor(context),
      icon: Icon(
        Icons.error_outline,
        color: AppThemes.getErrorIconColor(context),
        size: 24,
        semanticLabel: 'Error icon',
      ),
      title: Text('Error', style: AppThemes.getErrorTitleTextStyle(context)),
      content: Text(
        message,
        style: AppThemes.getErrorContentTextStyle(context),
      ),
      actions: _buildDialogActions(context),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }

  List<Widget> _buildDialogActions(BuildContext context) {
    if (actions.isEmpty && autoDismiss > Duration.zero) {
      return [];
    }

    if (actions.isEmpty) {
      return [
        if (Platform.isCupertino)
          CupertinoDialogAction(
            onPressed: () {
              final router = GoRouter.of(context);
              if (router.canPop()) {
                router.pop();
              }
            },
            child: Text(
              'OK',
              style: TextStyle(color: AppThemes.getPrimaryColor(context)),
            ),
          )
        else
          TextButton(
            onPressed: () {
              final router = GoRouter.of(context);
              if (router.canPop()) {
                router.pop();
              }
            },
            style: TextButton.styleFrom(
              foregroundColor: AppThemes.getPrimaryColor(context),
            ),
            child: const Text('OK'),
          ),
      ];
    }

    return actions.map((action) {
      if (Platform.isCupertino) {
        return CupertinoDialogAction(
          onPressed: action.onPressed,
          child: Text(
            action.label,
            style: TextStyle(color: AppThemes.getPrimaryColor(context)),
          ),
        );
      } else {
        return TextButton(
          onPressed: action.onPressed,
          style: TextButton.styleFrom(
            foregroundColor: AppThemes.getPrimaryColor(context),
          ),
          child: Text(action.label),
        );
      }
    }).toList();
  }
}
