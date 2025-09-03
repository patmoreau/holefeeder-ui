import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/presentation/services.dart';
import 'package:holefeeder/presentation/widgets.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<DashboardViewModel>(
        create:
            (context) => DashboardViewModel(
              repository: context.read<AccountRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<DashboardViewModel>(
          builder:
              (context, model, child) => FormStateHandler(
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
        ),
      );
}
