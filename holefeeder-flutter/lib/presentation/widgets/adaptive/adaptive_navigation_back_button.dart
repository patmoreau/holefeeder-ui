import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

class AdaptiveNavigationBackButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String previousPageTitle;

  const AdaptiveNavigationBackButton({
    super.key,
    required this.onPressed,
    required this.previousPageTitle,
  });

  @override
  Widget build(BuildContext context) {
    return Platform.isCupertino
        ? CupertinoNavigationBarBackButton(
          previousPageTitle: previousPageTitle,
          onPressed: onPressed,
        )
        : BackButton(onPressed: onPressed);
  }
}
