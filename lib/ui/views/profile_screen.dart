import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/views/profile_form.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

import 'package:holefeeder/core/repositories/repositories.dart';

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
            authenticationClient: ctx.read<AuthenticationClient>(),
            accountRepository: ctx.read<AccountRepository>(),
            categoryRepository: ctx.read<CategoryRepository>(),
            tagRepository: ctx.read<TagRepository>(),
            transactionRepository: ctx.read<TransactionRepository>(),
            upcomingRepository: ctx.read<UpcomingRepository>(),
            userSettingsRepository: ctx.read<UserSettingsRepository>(),
            notificationService: NotificationServiceProvider.of(ctx),
          ),
      builder: (model) {
        _navigationSubscription ??= model.navigationStream.listen((route) {
          if (mounted) {
            // ignore: use_build_context_synchronously
            context.go(route);
          }
        });

        return ProfileForm(model: model);
      },
    );
  }
}
