import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/ui/views/account_screen.dart';
import 'package:holefeeder/ui/views/home_screen.dart';
import 'package:holefeeder/ui/views/login_screen.dart';
import 'package:holefeeder/ui/views/purchase_screen.dart';
import 'package:holefeeder/ui/views/transaction_screen.dart';
import 'package:holefeeder/ui/views/upcoming_screen.dart';
import 'package:provider/provider.dart';

import 'core/enums/authentication_status_enum.dart';
import 'holefeeder_app.dart';
import 'main.dart';

final GoRouter router = GoRouter(
  navigatorKey: HolefeederApp.navigatorKey,
  routes: [
    GoRoute(
      path: '/',
      redirect: (context, state) async {
        final authenticationClient = Provider.of<AuthenticationClient>(
          context,
          listen: false,
        );

        final status = await authenticationClient.statusStream.first;
        if (status != AuthenticationStatus.authenticated) {
          return '/login';
        }

        // Conditionally delay initial navigation
        if (launchedFromQuickAction) {
          launchedFromQuickAction = false; // Reset the flag
          Future.delayed(Duration.zero, () {
            return '/purchase';
          });
          return null; // Prevent immediate navigation
        }

        return null;
      },
      builder: (context, state) => HomeScreen(initialIndex: 0),
    ),
    GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => HomeScreen(initialIndex: 0),
    ),
    GoRoute(
      path: '/cashflow',
      builder: (context, state) => HomeScreen(initialIndex: 1),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => HomeScreen(initialIndex: 2),
    ),
    GoRoute(
      path: '/purchase',
      pageBuilder: (context, state) {
        return CupertinoPage(
          fullscreenDialog: true,
          child: PurchaseScreen(account: state.extra as Account?),
        );
      },
    ),
    GoRoute(
      path: '/modify-transaction',
      pageBuilder: (context, state) {
        return CupertinoPage(
          fullscreenDialog: true,
          child: EditTransactionScreen(
            transaction: state.extra as Transaction?,
          ),
        );
      },
    ),
    GoRoute(
      path: '/pay',
      pageBuilder: (context, state) {
        return CupertinoPage(
          fullscreenDialog: true,
          child: UpcomingScreen(upcoming: state.extra as Upcoming),
        );
      },
    ),
    GoRoute(
      path: '/account',
      builder: (context, state) {
        return AccountScreen(account: state.extra as Account);
      },
    ),
  ],
);
