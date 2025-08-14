import 'dart:developer' as developer;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/platform.dart';
import 'package:pull_down_button/pull_down_button.dart';

class AdaptivePicker<T> extends StatelessWidget {
  final T? value;
  final List<T> items;
  final String Function(T) displayStringFor;
  final ValueChanged<T?> onChanged;
  final String? placeholder;
  final bool enabled;
  final bool isExpanded;

  const AdaptivePicker({
    super.key,
    required this.value,
    required this.items,
    required this.displayStringFor,
    required this.onChanged,
    this.placeholder,
    this.enabled = true,
    this.isExpanded = true,
  });

  @override
  Widget build(BuildContext context) {
    developer.log(
      'Building picker field for ${items.length} items, platform: ${Platform.isCupertino ? "Apple" : "Other"}',
      name: 'AdaptivePicker',
    );
    return Platform.isCupertino
        ? _buildCupertinoPicker(context)
        : _buildMaterialPicker(context);
  }

  Widget _buildCupertinoPicker(BuildContext context) {
    return PullDownButton(
      itemBuilder: (context) {
        return items.map((T item) {
          return PullDownMenuItem(
            title: displayStringFor(item),
            itemTheme: PullDownMenuItemTheme(
              textStyle: CupertinoTheme.of(context).textTheme.textStyle,
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
            mainAxisSize: isExpanded ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if (isExpanded)
                Expanded(
                  child: Text(
                    value != null
                        ? displayStringFor(value as T)
                        : (placeholder ?? 'Select...'),
                    style: AppThemes.getFormFieldTextStyle(context).copyWith(
                      color:
                          value != null
                              ? CupertinoTheme.of(
                                context,
                              ).textTheme.textStyle.color
                              : CupertinoColors.placeholderText.resolveFrom(
                                context,
                              ),
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                    textAlign: TextAlign.right,
                  ),
                )
              else
                Flexible(
                  child: Text(
                    value != null
                        ? displayStringFor(value as T)
                        : (placeholder ?? 'Select...'),
                    style: AppThemes.getFormFieldTextStyle(context).copyWith(
                      color:
                          value != null
                              ? CupertinoTheme.of(
                                context,
                              ).textTheme.textStyle.color
                              : CupertinoColors.placeholderText.resolveFrom(
                                context,
                              ),
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                    textAlign: TextAlign.right,
                  ),
                ),
              const SizedBox(width: 8),
              Icon(
                CupertinoIcons.chevron_up_chevron_down,
                size: 14, // iOS standard icon size
                color:
                    enabled
                        ? CupertinoColors.systemGrey.resolveFrom(context)
                        : CupertinoColors.systemGrey3.resolveFrom(context),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMaterialPicker(BuildContext context) {
    return DropdownButtonFormField<T>(
      value: value,
      isExpanded: isExpanded,
      decoration: InputDecoration(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Theme.of(context).colorScheme.outline),
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
            color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.5),
          ),
        ),
        contentPadding: AppThemes.getFormRowPadding(context),
        filled: true,
        fillColor:
            enabled
                ? Theme.of(context).colorScheme.surface
                : Theme.of(
                  context,
                ).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        hintText: placeholder ?? 'Select...',
        hintStyle: TextStyle(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
      style: AppThemes.getFormFieldTextStyle(context),
      icon: Icon(
        Icons.arrow_drop_down,
        size: 24, // Material standard icon size
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
    );
  }
}
