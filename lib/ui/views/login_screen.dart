import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';
import 'package:holefeeder/core/view_models/screens/login_view_model.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<LoginViewModel>(
      model: LoginViewModel(
        authenticationProvider: context.read<AuthenticationClient>(),
        notificationService: context.read<NotificationService>(),
      ),
      builder:
          (model) => Scaffold(
            appBar: AppBar(title: Text(model.screenTitle)),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (model.hasError)
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        model.error ?? 'An error occurred',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  if (model.isLoading)
                    const CircularProgressIndicator()
                  else
                    ElevatedButton(
                      onPressed: model.login,
                      child: Text(model.loginTitle),
                    ),
                ],
              ),
            ),
          ),
    );
  }
}
