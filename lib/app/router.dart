import 'dart:developer' as developer;

import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/presentation.dart';
import 'package:provider/provider.dart';

import 'holefeeder_app.dart';

const kTrueHome = '/dashboard';

final GoRouter router = GoRouter(
  navigatorKey: HolefeederApp.navigatorKey,
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (context, state) => SplashScreen()),
    GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => HomeScreen(initialIndex: 0),
    ),
    GoRoute(
      path: '/cashflows',
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
      path: '/modify-cashflow',
      pageBuilder: (context, state) {
        return CupertinoPage(
          fullscreenDialog: true,
          child: EditCashflowScreen(cashflow: state.extra as Cashflow?),
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
  redirect: (context, state) {
    developer.log(
      'Redirecting from ${state.matchedLocation}',
      name: 'GoRouter',
    );
    final authenticationClient = context.read<AuthenticationClient>();
    final isAuthenticated = authenticationClient.isAuthenticated;
    final isLoginPage = state.matchedLocation == '/login';
    final isSplashPage = state.matchedLocation == '/splash';

    // Allow splash screen to handle initial navigation
    if (isSplashPage) {
      developer.log(
        'Splash screen detected, allowing navigation',
        name: 'GoRouter',
      );
      return null;
    }

    if (!isAuthenticated && !isLoginPage) {
      developer.log(
        'User not authenticated, redirecting to login',
        name: 'GoRouter',
      );
      return '/login';
    }

    // Redirect to dashboard if authenticated and on login page
    if (isAuthenticated && isLoginPage) {
      developer.log(
        'User authenticated, redirecting from login to dashboard',
        name: 'GoRouter',
      );
      return '/dashboard';
    }

    return null;
  },
);
