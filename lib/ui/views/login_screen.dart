import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/providers/notification_provider.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';
import 'package:holefeeder/core/view_models/screens/login_view_model.dart';
import 'package:holefeeder/ui/widgets/form_state_handler.dart';
import 'package:holefeeder/ui/widgets/platform_button_widget.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late StreamSubscription<String> _navigationSubscription;

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<LoginViewModel>(
      model: LoginViewModel(
        authenticationProvider: context.read<AuthenticationClient>(),
        notificationService: NotificationServiceProvider.of(context),
      ),
      builder: (model) {
        _navigationSubscription = model.navigationStream.listen((route) {
          if (mounted) {
            context.go(route);
          }
        });

        return Scaffold(
          appBar: AppBar(title: Text(model.screenTitle)),
          body: FormStateHandler(
            formState: model.formState,
            builder: () => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  PlatformButton(
                    onPressed: model.login,
                    label: model.loginTitle,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _navigationSubscription.cancel();
    super.dispose();
  }
}
