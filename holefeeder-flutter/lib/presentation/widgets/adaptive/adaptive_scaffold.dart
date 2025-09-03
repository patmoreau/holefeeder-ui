import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

import 'adaptive_navigation_item.dart';
import 'cupertino_page_scaffold_mixin.dart';

class AdaptiveScaffold extends StatelessWidget with CupertinoPageScaffoldMixin {
  final Widget child;
  final String? title;
  final List<AdaptiveNavigationItem>? navigationItems;
  final int currentIndex;
  final Function(int)? onNavigationChanged;
  @override
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  @override
  final Widget? leading;
  @override
  final bool showAppBar;
  @override
  final Color? backgroundColor;
  final Widget? bottomBar; // New parameter

  const AdaptiveScaffold({
    super.key,
    required this.child,
    this.title,
    this.navigationItems,
    this.currentIndex = 0,
    this.onNavigationChanged,
    this.actions,
    this.floatingActionButton,
    this.leading,
    this.showAppBar = true,
    this.backgroundColor,
    this.bottomBar, // New parameter
  });

  static bool get isCupertino => Platform.isCupertino;

  @override
  Widget get body => child;

  @override
  Widget build(BuildContext context) {
    return isCupertino ? _buildCupertinoScaffold() : _buildMaterialScaffold();
  }

  Widget _buildCupertinoScaffold() {
    if (bottomBar != null) {
      // If a custom bottomBar is provided, it takes precedence.
      // Construct a CupertinoPageScaffold with the bottomBar.
      // navigationItems are ignored for the bottom bar in this case for Cupertino.
      return CupertinoPageScaffold(
        backgroundColor: backgroundColor,
        navigationBar:
            showAppBar
                ? CupertinoNavigationBar(
                  middle: pageTitle, // From CupertinoPageScaffoldMixin
                  leading: leading,
                  trailing:
                      actions != null && actions!.isNotEmpty
                          ? Row(
                            mainAxisSize: MainAxisSize.min,
                            children: actions!,
                          )
                          : null,
                )
                : null,
        child: Column(
          children: [
            Expanded(
              // 'body' is this.child via the mixin's getter
              child: SafeArea(
                top: false,
                // CupertinoNavigationBar handles top safe area.
                bottom: false,
                // We'll handle bottom safe area separately for the bottomBar
                child: body,
              ),
            ),
            SafeArea(
              top: false, // Only care about bottom safe area for the bottomBar
              child: bottomBar!,
            ),
          ],
        ),
      );
    } else if (navigationItems != null && navigationItems!.isNotEmpty) {
      // No custom bottomBar, but navigationItems are present. Use CupertinoTabScaffold.
      return CupertinoTabScaffold(
        tabBar: CupertinoTabBar(
          currentIndex: currentIndex,
          onTap: onNavigationChanged,
          items:
              navigationItems!
                  .map(
                    (item) => BottomNavigationBarItem(
                      icon: Icon(item.icon),
                      activeIcon: Icon(item.activeIcon ?? item.icon),
                      label: item.label,
                    ),
                  )
                  .toList(),
        ),
        // For each tab, build a standard CupertinoPageScaffold using the mixin's method.
        tabBuilder:
            (context, index) => CupertinoTabView(
              builder:
                  (context) =>
                      buildCupertinoPageScaffold(), // From CupertinoPageScaffoldMixin
            ),
      );
    } else {
      // No custom bottomBar and no navigationItems.
      // Use the mixin's method to build a basic CupertinoPageScaffold.
      return buildCupertinoPageScaffold(); // From CupertinoPageScaffoldMixin
    }
  }

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
    bottomNavigationBar:
        bottomBar ?? // Prioritize new bottomBar
        (navigationItems != null
            ? BottomNavigationBar(
              currentIndex: currentIndex,
              onTap: onNavigationChanged,
              type:
                  navigationItems!.length > 3
                      ? BottomNavigationBarType.shifting
                      : BottomNavigationBarType.fixed,
              items:
                  navigationItems!
                      .map(
                        (item) => BottomNavigationBarItem(
                          icon: Icon(item.icon),
                          activeIcon: Icon(item.activeIcon ?? item.icon),
                          label: item.label,
                        ),
                      )
                      .toList(),
            )
            : null),
    floatingActionButton: floatingActionButton,
  );

  @override
  Text? get pageTitle {
    if (title != null) {
      return Text(title!);
    }
    if (navigationItems != null &&
        navigationItems!.isNotEmpty &&
        currentIndex < navigationItems!.length) {
      return Text(navigationItems![currentIndex].label);
    }
    return null;
  }
}
