import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

import 'adaptive_navigation_item.dart';
import 'cupertino_page_scaffold_mixin.dart';

class AdaptiveNavigationScaffold extends StatelessWidget
    with CupertinoPageScaffoldMixin {
  final Widget child;
  final String? title;
  final List<AdaptiveNavigationItem> navigationItems;
  final int currentIndex;
  final Function(int) onNavigationChanged;
  @override
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  @override
  final Widget? leading;
  @override
  final bool showAppBar;
  @override
  final Color? backgroundColor;
  final bool useNavigationRail; // For tablet/desktop layouts

  const AdaptiveNavigationScaffold({
    super.key,
    required this.child,
    required this.navigationItems,
    required this.currentIndex,
    required this.onNavigationChanged,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.leading,
    this.showAppBar = true,
    this.backgroundColor,
    this.useNavigationRail = false,
  });

  static bool get isCupertino => UniversalPlatform.isApple;

  @override
  Widget build(BuildContext context) {
    if (useNavigationRail) {
      return _buildNavigationRailScaffold();
    }

    return isCupertino ? _buildCupertinoScaffold() : _buildMaterialScaffold();
  }

  Widget _buildNavigationRailScaffold() {
    if (isCupertino) {
      return buildCupertinoPageScaffold();
    }

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: currentIndex,
            onDestinationSelected: onNavigationChanged,
            labelType: NavigationRailLabelType.all,
            destinations:
                navigationItems
                    .map(
                      (item) => NavigationRailDestination(
                        icon: Icon(item.icon),
                        selectedIcon: Icon(item.activeIcon ?? item.icon),
                        label: Text(item.label),
                      ),
                    )
                    .toList(),
          ),
          const VerticalDivider(thickness: 1, width: 1),
          Expanded(
            child: Column(
              children: [
                if (showAppBar)
                  AppBar(
                    title: title != null ? Text(title!) : null,
                    leading: leading,
                    actions: actions,
                    automaticallyImplyLeading: false,
                  ),
                Expanded(child: body),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCupertinoScaffold() => CupertinoTabScaffold(
    tabBar: CupertinoTabBar(
      currentIndex: currentIndex,
      onTap: onNavigationChanged,
      items:
          navigationItems
              .map(
                (item) => BottomNavigationBarItem(
                  icon: Icon(item.icon),
                  activeIcon: Icon(item.activeIcon ?? item.icon),
                  label: item.label,
                ),
              )
              .toList(),
    ),
    tabBuilder:
        (context, index) => CupertinoTabView(
          builder: (context) => buildCupertinoPageScaffold(),
        ),
  );

  Widget _buildMaterialScaffold() => Scaffold(
    backgroundColor: backgroundColor,
    appBar:
        showAppBar
            ? AppBar(
              title: title != null ? Text(title!) : null,
              leading: leading,
              actions: actions,
            )
            : null,
    body: body,
    bottomNavigationBar: BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onNavigationChanged,
      type:
          navigationItems.length > 3
              ? BottomNavigationBarType.shifting
              : BottomNavigationBarType.fixed,
      items:
          navigationItems
              .map(
                (item) => BottomNavigationBarItem(
                  icon: Icon(item.icon),
                  activeIcon: Icon(item.activeIcon ?? item.icon),
                  label: item.label,
                ),
              )
              .toList(),
    ),
    floatingActionButton: floatingActionButton,
  );

  @override
  Widget get body =>
      !useNavigationRail
          ? child
          : Row(
            children: [
              Container(
                width: 270,
                decoration: BoxDecoration(
                  border: Border(
                    right: BorderSide(color: CupertinoColors.separator),
                  ),
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    ...navigationItems.asMap().entries.map((entry) {
                      final index = entry.key;
                      final item = entry.value;
                      return GestureDetector(
                        onTap: () => onNavigationChanged(index),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          color:
                              currentIndex == index
                                  ? CupertinoColors.systemGrey5
                                  : null,
                          child: Row(
                            children: [
                              Icon(
                                currentIndex == index
                                    ? item.activeIcon ?? item.icon
                                    : item.icon,
                                color:
                                    currentIndex == index
                                        ? CupertinoColors.activeBlue
                                        : null,
                              ),
                              const SizedBox(width: 12),
                              Text(
                                item.label,
                                style: TextStyle(
                                  color:
                                      currentIndex == index
                                          ? CupertinoColors.activeBlue
                                          : null,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),
              Expanded(child: child),
            ],
          );

  @override
  Text? get pageTitle {
    if (title != null) {
      return Text(title!);
    }
    if (navigationItems.isNotEmpty && currentIndex < navigationItems.length) {
      return Text(navigationItems[currentIndex].label);
    }
    return null;
  }
}
