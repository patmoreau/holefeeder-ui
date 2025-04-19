import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/ui/services/notification_provider.dart';
import 'package:holefeeder/core/utils/authentication_client.dart';
import 'package:holefeeder/core/view_models/screens/profile_view_model.dart';
import 'package:holefeeder/ui/views/profile_form.dart';
import 'package:holefeeder/ui/widgets/form_state_handler.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  StreamSubscription<String>? _navigationSubscription;

  @override
  void dispose() {
    _navigationSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<ProfileViewModel>(
      create:
          (ctx) => ProfileViewModel(
            authenticationProvider: ctx.read<AuthenticationClient>(),
            notificationService: NotificationServiceProvider.of(context),
          ),
      builder: (model) {
        _navigationSubscription ??= model.navigationStream.listen((route) {
          if (mounted) {
            // ignore: use_build_context_synchronously
            context.go(route);
          }
        });

        return UniversalPlatform.isApple
            ? _buildCupertinoScaffold(model)
            : _buildMaterialScaffold(model);
      },
    );
  }

  Widget _buildCupertinoScaffold(ProfileViewModel model) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(middle: Text(model.screenTitle)),
      child: SafeArea(
        child: FormStateHandler(
          formState: model.formState,
          builder: () => ProfileForm(model: model),
        ),
      ),
    );
  }

  Widget _buildMaterialScaffold(ProfileViewModel model) {
    return Scaffold(
      appBar: AppBar(title: Text(model.screenTitle)),
      body: FormStateHandler(
        formState: model.formState,
        builder: () => ProfileForm(model: model),
      ),
    );
  }
}
