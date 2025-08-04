import 'package:flutter/widgets.dart';
import 'package:universal_platform/universal_platform.dart';

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
      UniversalPlatform.isApple
          ? cupertinoBuilder(context)
          : materialBuilder(context);
}
