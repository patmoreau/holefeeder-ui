import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

class AdaptiveIconButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Icon icon;
  final EdgeInsetsGeometry? padding;

  const AdaptiveIconButton({
    super.key,
    this.onPressed,
    required this.icon,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Platform.isCupertino
        ? CupertinoButton(
          padding: padding ?? EdgeInsets.zero,
          onPressed: onPressed,
          child: icon,
        )
        : IconButton(
          padding: padding ?? EdgeInsets.zero,
          onPressed: onPressed,
          icon: icon,
        );
  }
}
