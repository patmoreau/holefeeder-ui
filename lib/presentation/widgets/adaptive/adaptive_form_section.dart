import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

class AdaptiveFormSection extends StatelessWidget {
  final String? header;
  final List<Widget> children;
  final EdgeInsets padding;
  final EdgeInsets childrenPadding;
  final double spacing;

  const AdaptiveFormSection({
    super.key,
    this.header,
    required this.children,
    this.padding = EdgeInsets.zero,
    this.childrenPadding = const EdgeInsets.all(16.0),
    this.spacing = 16.0,
  });

  @override
  Widget build(BuildContext context) {
    if (Platform.isCupertino) {
      return Padding(
        padding: padding,
        child: CupertinoFormSection.insetGrouped(
          header: header != null ? Text(header!) : null,
          children: children,
        ),
      );
    }

    return Padding(
      padding: padding,
      child: Card(
        margin: EdgeInsets.zero,
        child: Padding(
          padding: childrenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(height: spacing),
              if (header != null) ...[
                Text(header!, style: Theme.of(context).textTheme.titleMedium),
                SizedBox(height: spacing),
              ],
              for (var i = 0; i < children.length; i++) ...[
                children[i],
                if (i < children.length - 1) SizedBox(height: spacing),
              ],
              SizedBox(height: spacing),
            ],
          ),
        ),
      ),
    );
  }
}
