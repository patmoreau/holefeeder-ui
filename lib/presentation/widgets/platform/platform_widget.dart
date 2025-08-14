import 'package:flutter/widgets.dart';
import 'package:holefeeder/platform.dart';

class PlatformWidget extends StatelessWidget {
  const PlatformWidget({
    super.key,
    required this.materialBuilder,
    required this.cupertinoBuilder,
  });

  final WidgetBuilder materialBuilder;
  final WidgetBuilder cupertinoBuilder;

  @override
  Widget build(context) =>
      Platform.isCupertino
          ? cupertinoBuilder(context)
          : materialBuilder(context);
}
