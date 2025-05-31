import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveIconButton extends StatelessWidget {
  final VoidCallback onPressed;
  final Icon icon;

  const AdaptiveIconButton({
    super.key,
    required this.onPressed,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: onPressed,
          child: icon,
        )
        : IconButton(onPressed: onPressed, icon: icon);
  }
}
