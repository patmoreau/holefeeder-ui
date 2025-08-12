import 'dart:developer' as developer;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:pull_down_button/pull_down_button.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptivePicker<T> extends StatelessWidget {
  final String label;
  final T? value;
  final List<T> items;
  final String Function(T) displayStringFor;
  final ValueChanged<T?> onChanged;
  final String? placeholder;
  final bool enabled;

  const AdaptivePicker({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.displayStringFor,
    required this.onChanged,
    this.placeholder,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    developer.log(
      'Building picker for ${items.length} items, platform: ${UniversalPlatform.isApple ? "Apple" : "Other"}',
      name: 'AdaptivePicker',
    );
    return UniversalPlatform.isApple
        ? _buildCupertinoInlinePicker(context)
        : _buildMaterialDropdown(context);
  }

  Widget _buildCupertinoInlinePicker(BuildContext context) {
    return Container(
      padding: AppThemes.getFormRowPadding(context),
      decoration: BoxDecoration(
        color: CupertinoTheme.of(context).scaffoldBackgroundColor,
        border: Border(
          bottom: BorderSide(
            color: CupertinoColors.separator.resolveFrom(context),
            width: 0.5,
          ),
        ),
      ),
      child: Row(
        children: [
          // Label section with flexible width
          Flexible(
            flex: 2,
            child: Text(
              label,
              style: AppThemes.getFormLabelTextStyle(context),
              softWrap: true,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 16),
          // Picker section taking remaining space, right-aligned
          Expanded(
            flex: 3,
            child: Align(
              alignment: Alignment.centerRight,
              child: PullDownButton(
                itemBuilder: (context) {
                  return items.map((T item) {
                    return PullDownMenuItem(
                      title: displayStringFor(item),
                      itemTheme: PullDownMenuItemTheme(
                        textStyle:
                            CupertinoTheme.of(context).textTheme.textStyle,
                      ),
                      onTap: () {
                        if (enabled) onChanged.call(item);
                      },
                    );
                  }).toList();
                },
                buttonBuilder: (context, showMenu) {
                  return CupertinoButton(
                    onPressed: enabled ? showMenu : null,
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Flexible(
                          child: Text(
                            value != null
                                ? displayStringFor(value as T)
                                : (placeholder ?? 'Select...'),
                            style: AppThemes.getFormFieldTextStyle(
                              context,
                            ).copyWith(
                              color:
                                  value != null
                                      ? CupertinoTheme.of(
                                        context,
                                      ).textTheme.textStyle.color
                                      : CupertinoColors.placeholderText
                                          .resolveFrom(context),
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                            textAlign: TextAlign.right,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          CupertinoIcons.chevron_up_chevron_down,
                          size: 14, // Reduced icon size to match iOS standards
                          color:
                              enabled
                                  ? CupertinoColors.systemGrey.resolveFrom(
                                    context,
                                  )
                                  : CupertinoColors.systemGrey3.resolveFrom(
                                    context,
                                  ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMaterialDropdown(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              label,
              style: AppThemes.getFormLabelTextStyle(context),
              softWrap: true,
              overflow: TextOverflow.visible,
            ),
          ),
        DropdownButtonFormField<T>(
          value: value,
          isExpanded: true,
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(context).colorScheme.outline,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppThemes.getPrimaryColor(context),
                width: 2,
              ),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: Theme.of(
                  context,
                ).colorScheme.outline.withValues(alpha: 0.5),
              ),
            ),
            contentPadding: AppThemes.getFormRowPadding(context),
            filled: true,
            fillColor:
                enabled
                    ? Theme.of(context).colorScheme.surface
                    : Theme.of(context).colorScheme.surfaceContainerHighest
                        .withValues(alpha: 0.5),
            hintText: placeholder ?? 'Select...',
            hintStyle: TextStyle(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          style: AppThemes.getFormFieldTextStyle(context),
          icon: Icon(
            Icons.arrow_drop_down,
            size: 24, // Standard Material icon size
            color:
                enabled
                    ? Theme.of(context).colorScheme.onSurfaceVariant
                    : Theme.of(
                      context,
                    ).colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
          ),
          items:
              items.map((T item) {
                return DropdownMenuItem<T>(
                  value: item,
                  child: Text(
                    displayStringFor(item),
                    style: AppThemes.getFormFieldTextStyle(context),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                );
              }).toList(),
          onChanged: enabled ? onChanged : null,
          validator: (value) => null,
          dropdownColor: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          elevation: 8,
        ),
      ],
    );
  }
}
