import 'package:flutter/widgets.dart';

class AdaptiveNavigationItem {
  final IconData icon;
  final IconData? activeIcon;
  final String label;
  final Widget? badge;

  const AdaptiveNavigationItem({
    required this.icon,
    required this.label,
    this.activeIcon,
    this.badge,
  });
}
