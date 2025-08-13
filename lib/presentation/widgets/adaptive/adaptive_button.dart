import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

class AdaptiveButton extends StatelessWidget {
  final VoidCallback onPressed;
  final Widget child;

  const AdaptiveButton({
    super.key,
    required this.onPressed,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Platform.isCupertino
        ? CupertinoButton(onPressed: onPressed, child: child)
        : ElevatedButton(onPressed: onPressed, child: child);
  }
}
