import 'dart:developer' as developer;
import 'dart:math' as math;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/platform.dart';

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

  static bool get isCupertino => Platform.isCupertino;

  @override
  Widget build(BuildContext context) {
    if (useNavigationRail) {
      developer.log(
        'Using NavigationRail for adaptive navigation',
        name: 'AdaptiveNavigationScaffold',
      );
      return _buildNavigationRailScaffold(context);
    } else {
      developer.log(
        'Using BottomNavigationBar for adaptive navigation',
        name: 'AdaptiveNavigationScaffold',
      );
    }

    return isCupertino ? _buildCupertinoScaffold() : _buildMaterialScaffold();
  }

  Widget _buildNavigationRailScaffold(BuildContext context) {
    if (isCupertino) {
      return buildCupertinoPageScaffold();
    }

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Row(
        children: [
          NavigationRail(
            backgroundColor: Theme.of(context).colorScheme.surface,
            selectedIndex: currentIndex,
            onDestinationSelected: onNavigationChanged,
            labelType: NavigationRailLabelType.all,
            destinations:
                navigationItems
                    .map(
                      (item) => NavigationRailDestination(
                        icon: Icon(
                          item.icon,
                          size: 24,
                        ), // Standard Material icon size
                        selectedIcon: Icon(
                          item.activeIcon ?? item.icon,
                          size: 24,
                        ),
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
    bottomNavigationBar:
        useNavigationRail
            ? null
            : BottomNavigationBar(
              currentIndex: currentIndex,
              onTap: onNavigationChanged,
              iconSize: 24,
              // Material standard bottom nav icon size
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
      (useNavigationRail && Platform.isCupertino)
          ? Row(
            children: [_buildCupertinoNavigationRail(), Expanded(child: child)],
          )
          : child;

  Widget _buildCupertinoNavigationRail() {
    // We need to use a Builder to get access to context for color resolution
    return Builder(
      builder: (context) {
        // Calculate the optimal width based on content
        final textPainter = TextPainter(textDirection: TextDirection.ltr);

        double maxTextWidth = 0;
        for (final item in navigationItems) {
          textPainter.text = TextSpan(
            text: item.label,
            style: const TextStyle(
              fontSize: 15, // Slightly smaller for navigation rail
              fontWeight:
                  FontWeight.w600, // Use the bold weight for measurement
            ),
          );
          textPainter.layout();
          maxTextWidth = math.max(maxTextWidth, textPainter.width);
        }

        // Calculate total width: icon (20) + spacing (12) + text + horizontal padding (32) + margins (16) + extra for bold (8)
        final optimalWidth = 20 + 12 + maxTextWidth + 32 + 16 + 8;
        // Set minimum width to ensure it doesn't get too narrow
        final railWidth = math.max(optimalWidth, 150.0).toDouble();

        return Container(
          width: railWidth,
          decoration: BoxDecoration(
            color: CupertinoTheme.of(context).scaffoldBackgroundColor,
            border: Border(
              right: BorderSide(
                color: CupertinoColors.separator.resolveFrom(context),
                width: 0.5,
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              ...navigationItems.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                final isSelected = currentIndex == index;

                return CupertinoButton(
                  padding: EdgeInsets.zero,
                  onPressed: () => onNavigationChanged(index),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color:
                          isSelected
                              ? CupertinoColors.systemFill.resolveFrom(context)
                              : null,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    margin: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    child: Row(
                      children: [
                        Icon(
                          isSelected ? item.activeIcon ?? item.icon : item.icon,
                          color:
                              isSelected
                                  ? AppThemes.getPrimaryColor(context)
                                  : CupertinoColors.secondaryLabel.resolveFrom(
                                    context,
                                  ),
                          size: 20, // iOS standard navigation rail icon size
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            item.label,
                            style: TextStyle(
                              color:
                                  isSelected
                                      ? AppThemes.getPrimaryColor(context)
                                      : CupertinoColors.label.resolveFrom(
                                        context,
                                      ),
                              fontSize:
                                  15, // Slightly smaller for navigation rail
                              fontWeight:
                                  isSelected
                                      ? FontWeight.w600
                                      : FontWeight.normal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        );
      },
    );
  }

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
