import 'package:flutter/material.dart';
import 'package:holefeeder/core/providers/notification_provider.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';
import 'package:holefeeder/core/view_models/screens/login_view_model.dart';
import 'package:holefeeder/ui/views/login_form.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<LoginViewModel>(
      model: LoginViewModel(
        authenticationProvider: context.read<AuthenticationClient>(),
        notificationService: NotificationServiceProvider.of(context),
      ),
      builder:
          (model) => Scaffold(
            appBar: AppBar(title: Text(model.screenTitle)),
            body: LoginForm(model: model),
          ),
    );
  }
}
