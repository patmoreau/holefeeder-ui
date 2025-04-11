import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

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
