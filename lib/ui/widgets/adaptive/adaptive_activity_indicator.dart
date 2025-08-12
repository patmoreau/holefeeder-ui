import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveActivityIndicator extends StatelessWidget {
  const AdaptiveActivityIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? CupertinoActivityIndicator(
          color: CupertinoTheme.of(context).primaryColor,
        )
        : CircularProgressIndicator(color: Theme.of(context).primaryColor);
  }
}
