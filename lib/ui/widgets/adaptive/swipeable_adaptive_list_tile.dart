import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:universal_platform/universal_platform.dart';

/// Defines a single swipe action that can be performed on a list tile
class SwipeAction {
  /// The label to display for this action
  final String label;

  /// The icon to display for this action
  final IconData icon;

  /// The background color for this action
  final Color color;

  /// The callback to execute when this action is triggered
  final Future<void> Function() onTap;

  /// Whether this action is destructive and might require confirmation
  final bool isDestructive;

  const SwipeAction({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
    this.isDestructive = false,
  });
}

/// A swipeable list tile with configurable multiple actions for both left and right swipes.
class SwipeableAdaptiveListTile extends StatelessWidget {
  final Widget child;

  final Key dismissibleKey;

  final List<SwipeAction>? leadingActions;

  final List<SwipeAction>? trailingActions;

  const SwipeableAdaptiveListTile({
    super.key,
    required this.child,
    required this.dismissibleKey,
    this.leadingActions,
    this.trailingActions,
  });

  @override
  Widget build(BuildContext context) => Slidable(
    key: dismissibleKey,
    startActionPane:
        leadingActions != null && leadingActions!.isNotEmpty
            ? ActionPane(
              motion: const DrawerMotion(),
              extentRatio: 0.25 * leadingActions!.length,
              children:
                  leadingActions!
                      .map(
                        (action) => SlidableAction(
                          onPressed: (_) async => await action.onTap(),
                          backgroundColor: action.color,
                          foregroundColor: Colors.white,
                          icon: action.icon,
                          label: action.label,
                        ),
                      )
                      .toList(),
            )
            : null,
    endActionPane:
        trailingActions != null && trailingActions!.isNotEmpty
            ? ActionPane(
              motion: const DrawerMotion(),
              extentRatio: 0.25 * trailingActions!.length,
              children:
                  trailingActions!
                      .map(
                        (action) => SlidableAction(
                          onPressed: (_) async => await action.onTap(),
                          backgroundColor: action.color,
                          foregroundColor: Colors.white,
                          icon: action.icon,
                          label: action.label,
                        ),
                      )
                      .toList(),
            )
            : null,
    child: child,
  );
}

/// Utility functions for showing confirmation dialogs for swipe actions
class SwipeActionDialogs {
  /// Shows a simple confirmation dialog with yes/no options
  static Future<bool?> showConfirmationDialog(
    BuildContext context, {
    required String title,
    required String message,
    required Future<void> Function() action,
  }) async {
    final bool? result =
        UniversalPlatform.isApple
            ? await showCupertinoDialog<bool>(
              context: context,
              builder:
                  (context) => CupertinoAlertDialog(
                    title: Text(title),
                    content: Text(message),
                    actions: [
                      CupertinoDialogAction(
                        isDefaultAction: true,
                        child: Text(LocalizationService.current.cancel),
                        onPressed: () => Navigator.of(context).pop(false),
                      ),
                      CupertinoDialogAction(
                        isDestructiveAction: true,
                        child: Text(LocalizationService.current.yes),
                        onPressed: () async {
                          await action();
                          Navigator.of(context).pop(true);
                        },
                      ),
                    ],
                  ),
            )
            : await showDialog<bool>(
              context: context,
              builder:
                  (context) => AlertDialog(
                    title: Text(title),
                    content: Text(message),
                    actions: [
                      TextButton(
                        child: Text(LocalizationService.current.cancel),
                        onPressed: () => Navigator.of(context).pop(false),
                      ),
                      TextButton(
                        child: Text(LocalizationService.current.yes),
                        onPressed: () async {
                          await action();
                          Navigator.of(context).pop(true);
                        },
                      ),
                    ],
                  ),
            );

    return result ?? false;
  }

  /// Shows a dialog with multiple options
  static Future<bool?> showOptionsDialog(
    BuildContext context, {
    required String title,
    required String message,
    required Map<String, Future<void> Function()> options,
    bool isDestructive = false,
  }) async {
    final bool? result =
        UniversalPlatform.isApple
            ? await showCupertinoDialog<bool>(
              context: context,
              builder: (context) {
                final List<Widget> actions = [
                  CupertinoDialogAction(
                    isDefaultAction: true,
                    child: Text(LocalizationService.current.cancel),
                    onPressed: () => Navigator.of(context).pop(false),
                  ),
                ];

                options.forEach((label, action) {
                  actions.add(
                    CupertinoDialogAction(
                      isDestructiveAction: isDestructive,
                      child: Text(label),
                      onPressed: () async {
                        await action();
                        Navigator.of(context).pop(true);
                      },
                    ),
                  );
                });

                return CupertinoAlertDialog(
                  title: Text(title),
                  content: Text(message),
                  actions: actions,
                );
              },
            )
            : await showDialog<bool>(
              context: context,
              builder: (context) {
                final List<Widget> actions = [
                  TextButton(
                    child: Text(LocalizationService.current.cancel),
                    onPressed: () => Navigator.of(context).pop(false),
                  ),
                ];

                options.forEach((label, action) {
                  actions.add(
                    TextButton(
                      child: Text(label),
                      onPressed: () async {
                        await action();
                        Navigator.of(context).pop(true);
                      },
                    ),
                  );
                });

                return AlertDialog(
                  title: Text(title),
                  content: Text(message),
                  actions: actions,
                );
              },
            );

    return result ?? false;
  }
}
