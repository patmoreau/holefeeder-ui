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
            padding: padding,
            onTap: onTap,
            leading: leading,
            title: title,
            subtitle: subtitle,
            trailing: trailing,
            backgroundColor: CupertinoTheme.of(context).scaffoldBackgroundColor,
          )
          : ListTile(
            contentPadding: padding,
            onTap: onTap,
            leading: leading,
            title: title,
            subtitle: subtitle,
            trailing: trailing,
          );
}
