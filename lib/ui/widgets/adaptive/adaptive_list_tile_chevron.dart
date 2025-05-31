import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveListTileChevron extends StatelessWidget {
  const AdaptiveListTileChevron({super.key});

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? const CupertinoListTileChevron()
        : const Icon(Icons.chevron_right);
  }
}
