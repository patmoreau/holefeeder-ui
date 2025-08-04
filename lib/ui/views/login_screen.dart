import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  StreamSubscription<String>? _navigationSubscription;

  @override
  Widget build(BuildContext context) => ChangeNotifierProvider<LoginViewModel>(
    create:
        (context) => LoginViewModel(
          authenticationProvider: context.read<AuthenticationClient>(),
          notificationService: NotificationServiceProvider.of(context),
        ),
    child: Consumer<LoginViewModel>(
      builder: (context, model, child) {
        // Set up the navigation listener only once when the model is first provided
        _navigationSubscription ??= model.navigationStream.listen((route) {
          if (mounted) {
            // ignore: use_build_context_synchronously
            context.go(route);
          }
        });

        return AdaptiveScaffold(
          title: L10nService.current.loginTitle,
          child: FormStateHandler(
            formState: model.formState,
            onRetry: model.login,
            builder:
                () => Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AdaptiveButton(
                        onPressed: model.login,
                        child: Text(L10nService.current.loginTitle),
                      ),
                    ],
                  ),
                ),
          ),
        );
      },
    ),
  );

  @override
  void dispose() {
    _navigationSubscription?.cancel();
    super.dispose();
  }
}
