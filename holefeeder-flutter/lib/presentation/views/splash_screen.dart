import 'dart:developer' as developer;

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core.dart';
import 'package:provider/provider.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeApp();
    });
  }

  Future<void> _initializeApp() async {
    developer.log('Initializing app...', name: 'SplashScreen');
    if (mounted) {
      final authenticationService = Provider.of<AuthenticationClient>(
        context,
        listen: false,
      );
      final quickActionsService = Provider.of<QuickActionsService>(
        context,
        listen: false,
      );

      bool isAuthenticated = authenticationService.isAuthenticated;

      if (isAuthenticated) {
        developer.log('User is authenticated', name: 'SplashScreen');

        // Always handle pending actions when authenticated
        // This will either navigate to the pending action or default to dashboard
        await quickActionsService.handlePendingAction();
      } else {
        developer.log(
          'User not authenticated, going to login',
          name: 'SplashScreen',
        );
        // Not authenticated, go to login
        context.go('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 20),
            Text('Loading...'),
          ],
        ),
      ),
    );
  }
}
