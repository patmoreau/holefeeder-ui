import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveListTile extends StatelessWidget {
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Widget? leading;
  final Widget title;
  final Widget? subtitle;
  final Widget? trailing;

  const AdaptiveListTile({
    super.key,
    this.padding,
    this.onTap,
    this.leading,
    required this.title,
    this.subtitle,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) =>
      UniversalPlatform.isApple
          ? CupertinoListTile(
            padding:
                padding ??
                const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            onTap: onTap,
            leading: leading,
            title: title,
            subtitle: subtitle,
            trailing: trailing,
            backgroundColor: CupertinoColors.systemGroupedBackground
                .resolveFrom(context),
            backgroundColorActivated: CupertinoColors.systemGrey4.resolveFrom(
              context,
            ),
          )
          : ListTile(
            contentPadding:
                padding ??
                const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            onTap: onTap,
            leading: leading,
            title: title,
            subtitle: subtitle,
            trailing: trailing,
            // Use theme colors for Material
            tileColor: Theme.of(context).colorScheme.surface,
            hoverColor: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.08),
            splashColor: Theme.of(
              context,
            ).colorScheme.primary.withValues(alpha: 0.12),
          );
}
