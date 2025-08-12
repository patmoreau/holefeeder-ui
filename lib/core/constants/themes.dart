import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

import '../enums/category_type_enum.dart';
import 'theme_data_cupertino.dart';
import 'theme_data_material.dart';

/// Centralized theme configuration for the app
class AppThemes {
  AppThemes._();

  /// Primary brand color used across both platforms
  static const Color primaryBrandColor = Colors.orange;

  /// Get the appropriate theme data based on platform
  static ThemeData getMaterialTheme({bool isDark = false}) {
    return isDark
        ? buildDarkMaterialThemeData()
        : buildLightMaterialThemeData();
  }

  /// Get Cupertino theme data
  static CupertinoThemeData getCupertinoTheme(BuildContext context) {
    return buildCupertinoThemeData(context);
  }

  /// Get platform-appropriate primary color
  static Color getPrimaryColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(context).primaryColor;
    } else {
      return Theme.of(context).colorScheme.primary;
    }
  }

  /// Get platform-appropriate background color
  static Color getBackgroundColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(context).scaffoldBackgroundColor;
    } else {
      return Theme.of(context).colorScheme.background;
    }
  }

  /// Get platform-appropriate card/container color
  static Color getCardColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.secondarySystemBackground.resolveFrom(context);
    } else {
      return Theme.of(context).cardColor;
    }
  }

  /// Get platform-appropriate text color
  static Color getTextColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.label.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.onSurface;
    }
  }

  /// Get platform-appropriate secondary text color
  static Color getSecondaryTextColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.secondaryLabel.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.onSurfaceVariant;
    }
  }

  /// Get platform-appropriate placeholder text color
  static Color getPlaceholderTextColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.placeholderText.resolveFrom(context);
    } else {
      return Theme.of(context).hintColor;
    }
  }

  /// Get platform-appropriate surface color
  static Color getSurfaceColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(context).scaffoldBackgroundColor;
    } else {
      return Theme.of(context).colorScheme.surface;
    }
  }

  /// Get platform-appropriate divider color
  static Color getDividerColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.separator.resolveFrom(context);
    } else {
      return Theme.of(context).dividerColor;
    }
  }

  /// Get platform-appropriate border color
  static Color getBorderColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.separator.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.outline;
    }
  }

  /// Get platform-appropriate disabled color
  static Color getDisabledColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemGrey3.resolveFrom(context);
    } else {
      return Theme.of(context).disabledColor;
    }
  }

  /// Get platform-appropriate text style for titles
  static TextStyle getTitleTextStyle(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(context).textTheme.navTitleTextStyle;
    } else {
      return Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600) ??
          const TextStyle(fontSize: 16, fontWeight: FontWeight.w600);
    }
  }

  /// Get platform-appropriate text style for subtitles
  static TextStyle getSubtitleTextStyle(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(context).textTheme.textStyle.copyWith(
        fontSize: 13,
        color: CupertinoColors.secondaryLabel.resolveFrom(context),
      );
    } else {
      return Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ) ??
          TextStyle(
            fontSize: 12,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          );
    }
  }

  /// Get platform-appropriate expense color (red variants)
  static Color getExpenseColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemRed.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.error;
    }
  }

  /// Get platform-appropriate income color (green variants)
  static Color getIncomeColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemGreen.resolveFrom(context);
    } else {
      // Use a semantic green that works well with Material themes
      return Colors.green.shade600;
    }
  }

  /// Get platform-appropriate neutral/grey color
  static Color getNeutralColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemGrey.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.outline;
    }
  }

  /// Get platform-appropriate warning color (yellow/amber variants)
  static Color getWarningColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemYellow.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.secondary;
    }
  }

  /// Get platform-appropriate destructive color (red variants)
  static Color getDestructiveColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemRed.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.error;
    }
  }

  /// Get platform-appropriate system blue color
  static Color getSystemBlueColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.systemBlue.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.primary;
    }
  }

  /// Get color based on financial category type
  static Color getCategoryTypeColor(
    BuildContext context,
    CategoryType categoryType,
  ) {
    switch (categoryType) {
      case CategoryType.expense:
        return getExpenseColor(context);
      case CategoryType.gain:
        return getIncomeColor(context);
    }
  }

  /// Get projection-based color (for account projections)
  static Color getProjectionColor(
    BuildContext context,
    double projectionValue,
  ) {
    if (projectionValue == 0) {
      return getNeutralColor(context);
    } else if (projectionValue > 0) {
      return getIncomeColor(context);
    } else {
      return getExpenseColor(context);
    }
  }

  /// Get platform-appropriate error icon color
  static Color getErrorIconColor(BuildContext context) {
    return getDestructiveColor(context);
  }

  /// Get platform-appropriate error text color
  static Color getErrorTextColor(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoColors.label.resolveFrom(context);
    } else {
      return Theme.of(context).colorScheme.onSurface;
    }
  }

  /// Get platform-appropriate error title text style
  static TextStyle getErrorTitleTextStyle(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(
        context,
      ).textTheme.navTitleTextStyle.copyWith(color: getErrorTextColor(context));
    } else {
      return Theme.of(context).textTheme.headlineSmall?.copyWith(
            color: getErrorTextColor(context),
          ) ??
          TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: getErrorTextColor(context),
          );
    }
  }

  /// Get platform-appropriate error content text style
  static TextStyle getErrorContentTextStyle(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(
        context,
      ).textTheme.textStyle.copyWith(color: getErrorTextColor(context));
    } else {
      return Theme.of(
            context,
          ).textTheme.bodyMedium?.copyWith(color: getErrorTextColor(context)) ??
          TextStyle(fontSize: 14, color: getErrorTextColor(context));
    }
  }

  /// Get platform-appropriate form row padding
  static EdgeInsetsGeometry getFormRowPadding(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
    } else {
      return const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
    }
  }

  /// Get platform-appropriate form section spacing
  static double getFormSectionSpacing(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return 24.0;
    } else {
      return 16.0;
    }
  }

  /// Get platform-appropriate form field text style
  static TextStyle getFormFieldTextStyle(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(context).textTheme.textStyle;
    } else {
      return Theme.of(context).textTheme.bodyLarge ??
          const TextStyle(fontSize: 16);
    }
  }

  /// Get platform-appropriate form label text style
  static TextStyle getFormLabelTextStyle(BuildContext context) {
    if (UniversalPlatform.isApple) {
      return CupertinoTheme.of(
        context,
      ).textTheme.textStyle.copyWith(fontWeight: FontWeight.w500);
    } else {
      return Theme.of(
            context,
          ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w500) ??
          const TextStyle(fontSize: 14, fontWeight: FontWeight.w500);
    }
  }

  /// Get platform-appropriate list tile theme
  static Widget getListTile({
    required BuildContext context,
    Widget? leading,
    Widget? title,
    Widget? subtitle,
    Widget? trailing,
    VoidCallback? onTap,
    bool enabled = true,
    EdgeInsetsGeometry? contentPadding,
  }) {
    if (UniversalPlatform.isApple) {
      return Container(
        decoration: BoxDecoration(
          color: getCardColor(context),
          border: Border(
            bottom: BorderSide(color: getDividerColor(context), width: 0.5),
          ),
        ),
        child: CupertinoListTile(
          leading: leading,
          title: title ?? const SizedBox.shrink(),
          subtitle: subtitle,
          trailing: trailing,
          onTap: enabled ? onTap : null,
          padding: contentPadding ?? getFormRowPadding(context),
          backgroundColor: Colors.transparent,
        ),
      );
    } else {
      return ListTile(
        leading: leading,
        title: title,
        subtitle: subtitle,
        trailing: trailing,
        onTap: enabled ? onTap : null,
        enabled: enabled,
        contentPadding: contentPadding ?? getFormRowPadding(context),
        tileColor: getCardColor(context),
      );
    }
  }
}
