import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

/// A segmented control that adapts to the current platform.
///
/// On iOS/macOS, this widget uses a [CupertinoSlidingSegmentedControl].
/// On other platforms, it uses a Material-style segmented button.
class AdaptiveSegmentedControl<T extends Object> extends StatelessWidget {
  /// The value that is currently selected.
  final T groupValue;

  /// Called when a new value is selected.
  final ValueChanged<T?> onValueChanged;

  /// The map of segments to be shown as options.
  final Map<T, Widget> children;

  /// Background color for the segmented control.
  final Color? backgroundColor;

  /// Border color for Material segmented control.
  final Color? borderColor;

  /// Selected color for Material segmented control.
  final Color? selectedColor;

  /// Unselected color for Material segmented control.
  final Color? unselectedColor;

  const AdaptiveSegmentedControl({
    super.key,
    required this.groupValue,
    required this.onValueChanged,
    required this.children,
    this.backgroundColor,
    this.borderColor,
    this.selectedColor,
    this.unselectedColor,
  });

  @override
  Widget build(BuildContext context) {
    if (Platform.isCupertino) {
      return _buildCupertinoControl();
    } else {
      return _buildMaterialControl(context);
    }
  }

  Widget _buildCupertinoControl() {
    return CupertinoSlidingSegmentedControl<T>(
      groupValue: groupValue,
      onValueChanged: onValueChanged,
      children: children,
      backgroundColor: backgroundColor ?? CupertinoColors.systemGrey6,
    );
  }

  Widget _buildMaterialControl(BuildContext context) {
    final theme = Theme.of(context);
    final selectedButtonStyle = ButtonStyle(
      backgroundColor: WidgetStateProperty.all(
        selectedColor ?? theme.colorScheme.primaryContainer,
      ),
      foregroundColor: WidgetStateProperty.all(
        theme.colorScheme.onPrimaryContainer,
      ),
    );

    final unselectedButtonStyle = ButtonStyle(
      backgroundColor: WidgetStateProperty.all(
        unselectedColor ?? theme.colorScheme.surface,
      ),
      foregroundColor: WidgetStateProperty.all(theme.colorScheme.onSurface),
      side: WidgetStateProperty.all(
        BorderSide(color: borderColor ?? theme.colorScheme.outline),
      ),
    );

    return Container(
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: SegmentedButton<T>(
        segments:
            children.entries.map((entry) {
              return ButtonSegment<T>(value: entry.key, label: entry.value);
            }).toList(),
        selected: {groupValue},
        onSelectionChanged: (Set<T> selected) {
          if (selected.isNotEmpty) {
            onValueChanged(selected.first);
          }
        },
        style:
            selectedColor != null ||
                    unselectedColor != null ||
                    borderColor != null
                ? unselectedButtonStyle
                : selectedButtonStyle,
        emptySelectionAllowed: false,
      ),
    );
  }
}
