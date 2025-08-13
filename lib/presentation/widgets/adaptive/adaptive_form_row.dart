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

/// A specialized adaptive form row for text inputs with label
class AdaptiveFormField extends StatelessWidget {
  /// The label text
  final String label;

  /// The form field widget (TextField, AdaptivePickerField, etc.)
  final Widget field;

  /// Optional helper text
  final String? helper;

  /// Optional error text
  final String? error;

  /// Whether the field is required (shows asterisk)
  final bool required;

  /// Custom padding
  final EdgeInsetsGeometry? padding;

  const AdaptiveFormField({
    super.key,
    required this.label,
    required this.field,
    this.helper,
    this.error,
    this.required = false,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final labelWidget = RichText(
      text: TextSpan(
        style: AppThemes.getFormLabelTextStyle(context),
        children: [
          TextSpan(text: label),
          if (required)
            TextSpan(
              text: ' *',
              style: TextStyle(color: AppThemes.getErrorIconColor(context)),
            ),
        ],
      ),
    );

    return AdaptiveFormRow(
      prefix: labelWidget,
      padding: padding,
      helper: helper,
      error: error,
      child: field,
    );
  }
}

/// A specialized adaptive form row for sections with just content
class AdaptiveFormSection extends StatelessWidget {
  /// The section content
  final Widget child;

  /// Optional section title
  final String? title;

  /// Optional section footer text
  final String? footer;

  /// Custom padding
  final EdgeInsetsGeometry? padding;

  /// Custom margin
  final EdgeInsetsGeometry? margin;

  const AdaptiveFormSection({
    super.key,
    required this.child,
    this.title,
    this.footer,
    this.padding,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin:
          margin ??
          EdgeInsets.symmetric(
            vertical: AppThemes.getFormSectionSpacing(context) / 2,
          ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null) ...[
            Padding(
              padding: const EdgeInsets.only(left: 16, bottom: 8),
              child: Text(
                title!.toUpperCase(),
                style:
                    Platform.isCupertino
                        ? CupertinoTheme.of(
                          context,
                        ).textTheme.textStyle.copyWith(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: CupertinoColors.secondaryLabel.resolveFrom(
                            context,
                          ),
                        )
                        : Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppThemes.getSecondaryTextColor(context),
                            ) ??
                            TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppThemes.getSecondaryTextColor(context),
                            ),
              ),
            ),
          ],
          Platform.isCupertino
              ? CupertinoFormSection.insetGrouped(
                margin: EdgeInsets.zero,
                children: [child],
              )
              : Container(
                decoration: BoxDecoration(
                  color: AppThemes.getCardColor(context),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppThemes.getBorderColor(context)),
                ),
                child: child,
              ),
          if (footer != null) ...[
            Padding(
              padding: const EdgeInsets.only(left: 16, top: 8),
              child: Text(
                footer!,
                style:
                    Platform.isCupertino
                        ? CupertinoTheme.of(
                          context,
                        ).textTheme.textStyle.copyWith(
                          fontSize: 13,
                          color: CupertinoColors.secondaryLabel.resolveFrom(
                            context,
                          ),
                        )
                        : Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppThemes.getSecondaryTextColor(context),
                            ) ??
                            TextStyle(
                              fontSize: 12,
                              color: AppThemes.getSecondaryTextColor(context),
                            ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
