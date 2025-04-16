import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Form theme extension to store form-specific styling
class FormThemeExtension extends ThemeExtension<FormThemeExtension> {
  final EdgeInsets rowPadding;
  final double sectionSpacing;

  const FormThemeExtension({
    required this.rowPadding,
    required this.sectionSpacing,
  });

  @override
  ThemeExtension<FormThemeExtension> copyWith({
    EdgeInsets? rowPadding,
    double? sectionSpacing,
  }) {
    return FormThemeExtension(
      rowPadding: rowPadding ?? this.rowPadding,
      sectionSpacing: sectionSpacing ?? this.sectionSpacing,
    );
  }

  @override
  ThemeExtension<FormThemeExtension> lerp(
    ThemeExtension<FormThemeExtension>? other,
    double t,
  ) {
    if (other is! FormThemeExtension) return this;
    return FormThemeExtension(
      rowPadding: EdgeInsets.lerp(rowPadding, other.rowPadding, t)!,
      sectionSpacing: t * other.sectionSpacing + (1.0 - t) * sectionSpacing,
    );
  }
}

class ErrorDialogTheme extends ThemeExtension<ErrorDialogTheme> {
  final Color backgroundColor;
  final Color iconColor;
  final Color textColor;
  final double opacity;

  const ErrorDialogTheme({
    this.backgroundColor = CupertinoColors.systemRed,
    this.iconColor = CupertinoColors.systemRed,
    this.textColor = CupertinoColors.label,
    this.opacity = 0.1,
  });

  @override
  ErrorDialogTheme copyWith({
    Color? backgroundColor,
    Color? iconColor,
    Color? textColor,
    double? opacity,
  }) {
    return ErrorDialogTheme(
      backgroundColor: backgroundColor ?? this.backgroundColor,
      iconColor: iconColor ?? this.iconColor,
      textColor: textColor ?? this.textColor,
      opacity: opacity ?? this.opacity,
    );
  }

  @override
  ThemeExtension<ErrorDialogTheme> lerp(
    ThemeExtension<ErrorDialogTheme>? other,
    double t,
  ) {
    if (other is! ErrorDialogTheme) return this;
    return ErrorDialogTheme(
      backgroundColor: Color.lerp(backgroundColor, other.backgroundColor, t)!,
      iconColor: Color.lerp(iconColor, other.iconColor, t)!,
      textColor: Color.lerp(textColor, other.textColor, t)!,
      opacity: lerpDouble(opacity, other.opacity, t)!,
    );
  }
}

// Default theme extensions
const defaultFormTheme = FormThemeExtension(
  rowPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
  sectionSpacing: 24.0,
);

const defaultErrorDialogTheme = ErrorDialogTheme(
  backgroundColor: Colors.red,
  iconColor: Colors.red,
  textColor: Colors.black87,
  opacity: 0.1,
);

CupertinoThemeData holefeederCupertinoTheme = const CupertinoThemeData(
  applyThemeToAll: true,
  brightness: Brightness.light,
  primaryColor: CupertinoColors.activeBlue,
  textTheme: CupertinoTextThemeData(
    textStyle: TextStyle(
      fontFamily: 'SF Pro Display',
      fontSize: 16.0,
      color: CupertinoColors.black,
    ),
    navTitleTextStyle: TextStyle(
      fontWeight: FontWeight.bold,
      fontSize: 20.0,
      color: CupertinoColors.black,
    ),
    navLargeTitleTextStyle: TextStyle(
      fontWeight: FontWeight.bold,
      fontSize: 34.0,
      color: CupertinoColors.black,
    ),
    actionTextStyle: TextStyle(color: CupertinoColors.activeBlue),
    pickerTextStyle: TextStyle(color: CupertinoColors.black),
    dateTimePickerTextStyle: TextStyle(color: CupertinoColors.black),
  ),
  barBackgroundColor: CupertinoColors.systemGrey6,
  scaffoldBackgroundColor: CupertinoColors.systemBackground,
);

ThemeData holefeederMaterialTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.blue,
    brightness: Brightness.light,
  ),
  cardTheme: CardTheme(
    elevation: 0,
    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
  ),
  listTileTheme: const ListTileThemeData(
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  ),
  chipTheme: ChipThemeData(
    elevation: 0,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
  ),
  dividerTheme: const DividerThemeData(space: 1, indent: 16, endIndent: 16),
  scaffoldBackgroundColor: Colors.grey[100],
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
    titleTextStyle: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
  ),
  textTheme: const TextTheme(
    bodyLarge: TextStyle(fontSize: 16.0),
    bodyMedium: TextStyle(fontSize: 14.0),
    titleLarge: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
    titleMedium: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w500),
    labelLarge: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w500),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.blue,
      foregroundColor: Colors.white,
      textStyle: const TextStyle(fontSize: 18),
    ),
  ),
);
