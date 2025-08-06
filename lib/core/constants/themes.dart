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
