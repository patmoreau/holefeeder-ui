import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/views/dashboard_screen.dart';
import 'package:holefeeder/ui/views/profile_screen.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive.dart';

import 'cashflows_screen.dart';

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
      label: LocalizationService.current.dashboard,
    ),
    AdaptiveNavigationItem(
      icon: AdaptiveIcons.cashflow,
      activeIcon: AdaptiveIcons.cashflow,
      label: LocalizationService.current.cashflows,
    ),
    AdaptiveNavigationItem(
      icon: AdaptiveIcons.person,
      activeIcon: AdaptiveIcons.person,
      label: LocalizationService.current.profile,
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
