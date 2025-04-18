import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/l10n/l10n.dart';
import 'package:holefeeder/ui/views/dashboard_screen.dart';
import 'package:holefeeder/ui/views/profile_screen.dart';
import 'package:universal_platform/universal_platform.dart';

import 'categories_screen.dart';

class HomeScreen extends StatefulWidget {
  final int initialIndex;

  const HomeScreen({required this.initialIndex, super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late int currentPageIndex;
  late List<Widget> pages;

  @override
  void initState() {
    super.initState();
    currentPageIndex = widget.initialIndex;
    pages = const [DashboardScreen(), CategoriesScreen(), ProfileScreen()];
  }

  List<NavigationDestination> _buildNavigationDestinations(
    BuildContext context,
  ) => [
    NavigationDestination(
      icon: const Icon(Icons.home),
      label: AppLocalizations.of(context).home,
    ),
    NavigationDestination(
      icon: const Icon(Icons.category_outlined),
      label: AppLocalizations.of(context).categories,
    ),
    NavigationDestination(
      icon: const Icon(Icons.person),
      label: AppLocalizations.of(context).profile,
    ),
  ];

  List<BottomNavigationBarItem> _buildCupertinoItems(BuildContext context) => [
    BottomNavigationBarItem(
      icon: const Icon(CupertinoIcons.home),
      label: AppLocalizations.of(context).home,
    ),
    BottomNavigationBarItem(
      icon: const Icon(CupertinoIcons.paperplane_fill),
      label: AppLocalizations.of(context).categories,
    ),
    BottomNavigationBarItem(
      icon: const Icon(CupertinoIcons.person),
      label: AppLocalizations.of(context).profile,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? _buildForCupertino(context)
        : _buildForMaterial(context);
  }

  Widget _buildForCupertino(BuildContext context) => CupertinoTabScaffold(
    tabBar: CupertinoTabBar(
      items: _buildCupertinoItems(context),
      onTap: (index) {
        setState(() {
          currentPageIndex = index;
        });
      },
    ),
    tabBuilder: (context, index) {
      return pages[index];
    },
  );

  Widget _buildForMaterial(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: Text(AppLocalizations.of(context).holefeederTitle),
      foregroundColor: Colors.white,
    ),
    body: IndexedStack(index: currentPageIndex, children: pages),
    floatingActionButton: FloatingActionButton(
      onPressed: () {
        GoRouter.of(context).push('/purchase');
      },
      child: const Icon(Icons.add),
    ),
    bottomNavigationBar: NavigationBar(
      destinations: _buildNavigationDestinations(context),
      onDestinationSelected: (index) {
        setState(() {
          currentPageIndex = index;
        });
      },
      selectedIndex: currentPageIndex,
    ),
  );
}
