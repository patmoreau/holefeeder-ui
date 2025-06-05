import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptivePressable extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;

  const AdaptivePressable({super.key, required this.child, this.onTap});

  @override
  State<AdaptivePressable> createState() => _AdaptivePressableState();
}

class _AdaptivePressableState extends State<AdaptivePressable> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return GestureDetector(
        onTapDown: (_) => setState(() => _isPressed = true),
        onTapUp: (_) {
          setState(() => _isPressed = false);
          widget.onTap?.call();
        },
        onTapCancel: () => setState(() => _isPressed = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 100),
          color:
              _isPressed
                  ? CupertinoColors.systemGrey6.withOpacity(0.5)
                  : CupertinoColors.systemBackground,
          child: widget.child,
        ),
      );
    }

    return InkWell(onTap: widget.onTap, child: widget.child);
  }
}
