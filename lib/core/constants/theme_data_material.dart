import 'package:flutter/material.dart';

ThemeData buildLightMaterialThemeData() => ThemeData(
  useMaterial3: true,
  // Use orange to match Cupertino theme
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.orange,
    brightness: Brightness.light,
  ),

  // App Bar theme
  appBarTheme: const AppBarTheme(
    centerTitle: true,
    elevation: 0,
    scrolledUnderElevation: 1,
    backgroundColor: Colors.transparent,
    foregroundColor: null, // Uses colorScheme.onSurface
  ),

  // Card theme
  cardTheme: CardThemeData(
    elevation: 2,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),

  // Elevated Button theme
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      elevation: 2,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  ),

  // Text Button theme
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  ),

  // Outlined Button theme
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  ),

  // Input Decoration theme
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
  ),

  // List Tile theme - improved for better consistency
  listTileTheme: const ListTileThemeData(
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    minVerticalPadding: 8,
    dense: false,
  ),

  // Navigation Bar theme
  navigationBarTheme: const NavigationBarThemeData(
    elevation: 3,
    height: 80,
    labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
  ),

  // Bottom Sheet theme
  bottomSheetTheme: const BottomSheetThemeData(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
  ),

  // Dialog theme
  dialogTheme: DialogThemeData(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    elevation: 6,
  ),

  // Floating Action Button theme
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    elevation: 4,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
  ),

  // Divider theme for consistency with your list tiles
  dividerTheme: const DividerThemeData(thickness: 0.5, space: 1),
);

ThemeData buildDarkMaterialThemeData() => ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.orange,
    brightness: Brightness.dark,
  ),

  // App Bar theme
  appBarTheme: const AppBarTheme(
    centerTitle: true,
    elevation: 0,
    scrolledUnderElevation: 1,
    backgroundColor: Colors.transparent,
    foregroundColor: null, // Uses colorScheme.onSurface
  ),

  // Card theme
  cardTheme: CardThemeData(
    elevation: 2,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),

  // Elevated Button theme
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      elevation: 2,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  ),

  // Text Button theme
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  ),

  // Outlined Button theme
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
  ),

  // Input Decoration theme
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
  ),

  // List Tile theme - improved for better consistency
  listTileTheme: const ListTileThemeData(
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    minVerticalPadding: 8,
    dense: false,
  ),

  // Navigation Bar theme
  navigationBarTheme: const NavigationBarThemeData(
    elevation: 3,
    height: 80,
    labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
  ),

  // Bottom Sheet theme
  bottomSheetTheme: const BottomSheetThemeData(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
  ),

  // Dialog theme
  dialogTheme: DialogThemeData(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    elevation: 6,
  ),

  // Floating Action Button theme
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    elevation: 4,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
  ),

  // Divider theme for consistency with your list tiles
  dividerTheme: const DividerThemeData(thickness: 0.5, space: 1),
);
