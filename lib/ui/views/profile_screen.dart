import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/utils/utils.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/views/profile_form.dart';
import 'package:provider/provider.dart';

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
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<ProfileViewModel>(
        create:
            (context) => ProfileViewModel(
              authenticationClient: context.read<AuthenticationClient>(),
              accountRepository: context.read<AccountRepository>(),
              categoryRepository: context.read<CategoryRepository>(),
              tagRepository: context.read<TagRepository>(),
              transactionRepository: context.read<TransactionRepository>(),
              upcomingRepository: context.read<UpcomingRepository>(),
              userSettingsRepository: context.read<UserSettingsRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<ProfileViewModel>(
          builder: (context, model, child) {
            _navigationSubscription ??= model.navigationStream.listen((route) {
              if (mounted) {
                // ignore: use_build_context_synchronously
                context.go(route);
              }
            });

            return ProfileForm(model: model);
          },
        ),
      );
}
