import 'package:flutter/cupertino.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/platform.dart';

/// A specialized adaptive form row for sections with just content
class AdaptiveFormSection extends StatelessWidget {
  /// The section content
  final List<Widget> children;

  /// Optional section title
  final Widget? header;

  /// Optional section footer text
  final Widget? footer;

  /// Custom padding
  final EdgeInsetsGeometry? padding;

  /// Custom margin
  final EdgeInsetsGeometry? margin;

  const AdaptiveFormSection({
    super.key,
    required this.children,
    this.header,
    this.footer,
    this.padding,
    this.margin,
  });

  @override
  Widget build(BuildContext context) => Container(
    margin:
        margin ??
        EdgeInsets.symmetric(
          vertical: AppThemes.getFormSectionSpacing(context) / 2,
        ),
    child:
        Platform.isCupertino
            ? _buildCupertinoFormSection(context)
            : _buildMaterialFormSection(context),
  );

  Widget _buildCupertinoFormSection(BuildContext context) =>
      CupertinoFormSection.insetGrouped(
        margin: EdgeInsets.zero,
        header: header,
        footer: footer,
        children: children,
      );

  Widget _buildMaterialFormSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (header != null) ...[
          Padding(
            padding: const EdgeInsets.only(left: 16, bottom: 8),
            child: header,
          ),
        ],
        ...children.map(
          (child) => Container(
            decoration: BoxDecoration(
              color: AppThemes.getCardColor(context),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppThemes.getBorderColor(context)),
            ),
            child: child,
          ),
        ),
        if (footer != null) ...[
          Padding(
            padding: const EdgeInsets.only(left: 16, top: 8),
            child: footer,
          ),
        ],
      ],
    );
  }
}
