import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/widgets.dart';

import 'cashflows_screen.dart';
import 'dashboard_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  final int initialIndex;

  const HomeScreen({required this.initialIndex, super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late int _currentIndex;
  late List<Widget> pages;

  final List<AdaptiveNavigationItem> _navigationItems = [
    AdaptiveNavigationItem(
      icon: AdaptiveIcons.home_outlined,
      activeIcon: AdaptiveIcons.home,
      label: L10nService.current.dashboard,
    ),
    AdaptiveNavigationItem(
      icon: AdaptiveIcons.cashflow,
      activeIcon: AdaptiveIcons.cashflow,
      label: L10nService.current.cashflows,
    ),
    AdaptiveNavigationItem(
      icon: AdaptiveIcons.person,
      activeIcon: AdaptiveIcons.person,
      label: L10nService.current.profile,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    pages = const [DashboardScreen(), CashflowsScreen(), ProfileScreen()];
  }

  @override
  Widget build(BuildContext context) => AdaptiveNavigationScaffold(
    navigationItems: _navigationItems,
    currentIndex: _currentIndex,
    onNavigationChanged: (index) {
      setState(() => _currentIndex = index);
    },
    useNavigationRail: MediaQuery.of(context).size.width > 600,
    actions: [
      IconButton(
        icon: Icon(AdaptiveIcons.purchase),
        onPressed: () {
          context.push('/purchase');
        },
      ),
    ],
    child: pages[_currentIndex],
  );
}
