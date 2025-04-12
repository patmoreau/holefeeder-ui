import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:universal_platform/universal_platform.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/core/services/localization_service.dart';

class ErrorAction {
  final String label;
  final VoidCallback onPressed;

  const ErrorAction({required this.label, required this.onPressed});
}

class ErrorBanner extends StatefulWidget {
  final String message;
  final List<ErrorAction> actions;
  final Duration autoDismiss;

  ErrorBanner({
    super.key,
    String? message,
    List<ErrorAction>? actions,
    this.autoDismiss = Duration.zero,
  }) : message = message ?? LocalizationService.current.errorGeneric,
       actions = actions ?? [];

  @override
  State<ErrorBanner> createState() => _ErrorBannerState();
}

class _ErrorBannerState extends State<ErrorBanner>
    with SingleTickerProviderStateMixin {
  Timer? _dismissTimer;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOut,
    );
    _triggerHapticFeedback();
    _setupAutoDismiss();
    _animationController.forward();
  }

  @override
  void dispose() {
    _dismissTimer?.cancel();
    _animationController.dispose();
    super.dispose();
  }

  void _triggerHapticFeedback() {
    HapticFeedback.mediumImpact();
  }

  void _setupAutoDismiss() {
    if (widget.autoDismiss > Duration.zero) {
      _dismissTimer = Timer(widget.autoDismiss, () {
        if (mounted) {
          _animationController.reverse().then((_) {
            var router = GoRouter.of(context);
            if (router.canPop()) {
              router.pop();
            }
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: Semantics(
        container: true,
        label: 'Error alert: ${widget.message}',
        child:
            UniversalPlatform.isApple
                ? _buildCupertinoError(context)
                : _buildMaterialError(context),
      ),
    );
  }

  Widget _buildCupertinoError(BuildContext context) {
    final theme =
        Theme.of(context).extension<ErrorBannerTheme>() ??
        const ErrorBannerTheme();

    return CupertinoFormSection(
      backgroundColor: theme.backgroundColor.withValues(alpha: theme.opacity),
      header: Row(
        children: [
          Icon(
            CupertinoIcons.exclamationmark_triangle_fill,
            color: theme.iconColor,
            semanticLabel: 'Error icon',
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.message,
              style: TextStyle(color: theme.textColor),
            ),
          ),
        ],
      ),
      children:
          widget.actions.isEmpty
              ? [const SizedBox.shrink()]
              : widget.actions
                  .map(
                    (action) => Material(
                      type: MaterialType.transparency,
                      child: InkWell(
                        onTap: action.onPressed,
                        child: CupertinoButton(
                          padding: EdgeInsets.zero,
                          onPressed: action.onPressed,
                          child: Text(action.label),
                        ),
                      ),
                    ),
                  )
                  .toList(),
    );
  }

  Widget _buildMaterialError(BuildContext context) {
    final theme =
        Theme.of(context).extension<ErrorBannerTheme>() ??
        const ErrorBannerTheme();

    return Card(
      color: theme.backgroundColor.withValues(alpha: theme.opacity),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: Icon(
              Icons.error_outline,
              color: theme.iconColor,
              semanticLabel: 'Error icon',
            ),
            title: Text(
              widget.message,
              style: TextStyle(color: theme.textColor),
            ),
          ),
          OverflowBar(
            children:
                widget.actions.isEmpty
                    ? [const SizedBox.shrink()]
                    : widget.actions
                        .map(
                          (action) => TextButton(
                            onPressed: action.onPressed,
                            child: Text(action.label),
                          ),
                        )
                        .toList(),
          ),
        ],
      ),
    );
  }
}
