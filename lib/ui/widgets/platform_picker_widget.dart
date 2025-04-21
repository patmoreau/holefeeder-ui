import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pull_down_button/pull_down_button.dart';
import 'package:universal_platform/universal_platform.dart';

class PlatformPicker<T> extends StatelessWidget {
  final String label;
  final T? value;
  final List<T> items;
  final String Function(T) displayStringFor;
  final ValueChanged<T?> onChanged;
  final String? placeholder;

  const PlatformPicker({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.displayStringFor,
    required this.onChanged,
    this.placeholder,
  });

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? _buildCupertinoDropdown(context)
        : _buildMaterialDropdown(context);
  }

  Widget _buildCupertinoDropdown(BuildContext context) {
    return CupertinoFormRow(
      prefix: Text(label),
      child: PullDownButton(
        itemBuilder: (context) {
          return items.map((T item) {
            return PullDownMenuItem(
              title: displayStringFor(item),
              itemTheme: PullDownMenuItemTheme(
                textStyle: Theme.of(context).textTheme.labelLarge,
              ),
              onTap: () {
                onChanged(item);
              },
            );
          }).toList();
        },
        buttonBuilder: (context, showMenu) {
          return CupertinoButton(
            onPressed: showMenu,
            padding: EdgeInsets.zero,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  value != null
                      ? displayStringFor(value as T)
                      : (placeholder ?? 'Select...'),
                ),
                const Icon(CupertinoIcons.chevron_down),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMaterialDropdown(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: DropdownButtonFormField<T>(
        value: value,
        isExpanded: true,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
        ),
        items:
            items.map((T item) {
              return DropdownMenuItem<T>(
                value: item,
                child: Text(displayStringFor(item)),
              );
            }).toList(),
        onChanged: onChanged,
      ),
    );
  }
}
