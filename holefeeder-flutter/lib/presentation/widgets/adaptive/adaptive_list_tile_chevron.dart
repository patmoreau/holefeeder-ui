import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

class AdaptiveListTileChevron extends StatelessWidget {
  const AdaptiveListTileChevron({super.key});

  @override
  Widget build(BuildContext context) {
    return Platform.isCupertino
        ? const CupertinoListTileChevron()
        : const Icon(Icons.chevron_right);
  }
}
