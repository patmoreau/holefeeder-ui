import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/platform.dart';

/// An adaptive form row that uses CupertinoFormRow on Apple platforms
/// and a Material-equivalent design on other platforms.
class AdaptiveFormRow extends StatelessWidget {
  /// The label/prefix widget displayed on the left side
  final Widget? prefix;

  /// The main content widget (typically a form field)
  final Widget child;

  /// Optional helper text displayed below the row
  final String? helper;

  /// Optional error text displayed below the row
  final String? error;

  /// Custom padding for the row content
  final EdgeInsetsGeometry? padding;

  /// Background color for the row (defaults to platform-appropriate)
  final Color? backgroundColor;

  /// Whether to show a bottom border/divider
  final bool showDivider;

  /// Custom divider color
  final Color? dividerColor;

  const AdaptiveFormRow({
    super.key,
    this.prefix,
    required this.child,
    this.helper,
    this.error,
    this.padding,
    this.backgroundColor,
    this.showDivider = true,
    this.dividerColor,
  });

  @override
  Widget build(BuildContext context) {
    return Platform.isCupertino
        ? _buildCupertinoFormRow(context)
        : _buildMaterialFormRow(context);
  }

  Widget _buildCupertinoFormRow(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CupertinoFormRow(
          prefix: prefix,
          padding: padding ?? AppThemes.getFormRowPadding(context),
          child: child,
        ),
        if (helper != null || error != null)
          Padding(
            padding: EdgeInsets.only(
              left:
                  (padding?.horizontal ??
                      AppThemes.getFormRowPadding(context).horizontal) /
                  2,
              right:
                  (padding?.horizontal ??
                      AppThemes.getFormRowPadding(context).horizontal) /
                  2,
              top: 4,
              bottom: 8,
            ),
            child:
                error != null
                    ? Text(
                      error!,
                      style: CupertinoTheme.of(
                        context,
                      ).textTheme.textStyle.copyWith(
                        fontSize: 12,
                        color: CupertinoColors.systemRed.resolveFrom(context),
                      ),
                    )
                    : Text(
                      helper!,
                      style: CupertinoTheme.of(
                        context,
                      ).textTheme.textStyle.copyWith(
                        fontSize: 12,
                        color: CupertinoColors.secondaryLabel.resolveFrom(
                          context,
                        ),
                      ),
                    ),
          ),
      ],
    );
  }

  Widget _buildMaterialFormRow(BuildContext context) {
    final effectivePadding = padding ?? AppThemes.getFormRowPadding(context);
    final effectiveBackgroundColor =
        backgroundColor ?? AppThemes.getCardColor(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: effectivePadding,
          decoration: BoxDecoration(
            color: effectiveBackgroundColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color:
                  error != null
                      ? AppThemes.getErrorIconColor(context)
                      : AppThemes.getBorderColor(context),
              width: error != null ? 2 : 1,
            ),
          ),
          child:
              prefix != null
                  ? Row(
                    children: [
                      // Prefix section
                      if (prefix != null) ...[
                        Flexible(
                          flex: 2,
                          child: DefaultTextStyle(
                            style: AppThemes.getFormLabelTextStyle(context),
                            child: prefix!,
                          ),
                        ),
                        const SizedBox(width: 16),
                      ],
                      // Content section
                      Expanded(flex: 3, child: child),
                    ],
                  )
                  : child,
        ),
        if (helper != null || error != null)
          Padding(
            padding: EdgeInsets.only(
              left: effectivePadding.horizontal / 2,
              right: effectivePadding.horizontal / 2,
              top: 6,
              bottom: 8,
            ),
            child:
                error != null
                    ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 16,
                          color: AppThemes.getErrorIconColor(context),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            error!,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: AppThemes.getErrorIconColor(context),
                                ) ??
                                TextStyle(
                                  fontSize: 12,
                                  color: AppThemes.getErrorIconColor(context),
                                ),
                          ),
                        ),
                      ],
                    )
                    : Text(
                      helper!,
                      style:
                          Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppThemes.getSecondaryTextColor(context),
                          ) ??
                          TextStyle(
                            fontSize: 12,
                            color: AppThemes.getSecondaryTextColor(context),
                          ),
                    ),
          ),
        if (showDivider && error == null)
          Divider(
            height: 1,
            thickness: 1,
            color: dividerColor ?? AppThemes.getDividerColor(context),
          ),
      ],
    );
  }
}
