import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';
import 'package:holefeeder/core/view_models/screens/login_view_model.dart';
import 'package:holefeeder/ui/widgets/form_state_handler.dart';
import 'package:holefeeder/ui/widgets/platform_button_widget.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  StreamSubscription<String>? _navigationSubscription;

  @override
  void dispose() {
    _navigationSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider(
      create: (ctx) {
        final authenticationProvider = ctx.read<AuthenticationClient>();
        final notificationService = ctx.read<NotificationService>();
        return LoginViewModel(authenticationProvider: authenticationProvider, notificationService: notificationService);
      },
      builder: (model) {
        // Set up the navigation listener only once when the model is first provided
        _navigationSubscription ??= model.navigationStream.listen((route) {
          if (mounted) {
            // ignore: use_build_context_synchronously
            context.go(route);
          }
        });

        return UniversalPlatform.isApple ? _buildCupertinoScaffold(model) : _buildMaterialScaffold(model);
      },
    );
  }

  Widget _buildCupertinoScaffold(LoginViewModel model) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(middle: Text(model.screenTitle)),
      child: FormStateHandler(
        formState: model.formState,
        builder:
            () =>
                Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [PlatformButton(onPressed: model.login, label: model.loginTitle)])),
      ),
    );
  }

  Scaffold _buildMaterialScaffold(LoginViewModel model) {
    return Scaffold(
      appBar: AppBar(title: Text(model.screenTitle)),
      body: FormStateHandler(
        formState: model.formState,
        builder:
            () =>
                Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [PlatformButton(onPressed: model.login, label: model.loginTitle)])),
      ),
    );
  }
}
