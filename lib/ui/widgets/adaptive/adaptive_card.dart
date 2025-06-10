import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? backgroundColor;

  const AdaptiveCard({
    super.key,
    required this.child,
    this.padding,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return Container(
        padding: padding,
        decoration: BoxDecoration(
          color:
              backgroundColor ??
              CupertinoTheme.of(context).scaffoldBackgroundColor,
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(color: CupertinoColors.systemGrey4, width: 0.5),
        ),
        child: child,
      );
    }

    return Card(
      child: padding != null ? Padding(padding: padding!, child: child) : child,
    );
  }
}
