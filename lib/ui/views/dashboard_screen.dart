import 'package:flutter/material.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) => ViewModelProvider<DashboardViewModel>(
    create:
        (ctx) => DashboardViewModel(
          repository: ctx.read<AccountRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder:
        (model) => FormStateHandler(
          formState: model.formState,
          builder:
              () => RefreshIndicator.adaptive(
                onRefresh: model.refreshDashboard,
                child: ListView(
                  children: [
                    if (model.accounts.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text('No accounts found'),
                        ),
                      )
                    else
                      ...model.accounts.map(
                        (account) => AccountListTile(account: account),
                      ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
        ),
  );
}
