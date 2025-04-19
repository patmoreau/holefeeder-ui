import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/services/notification_provider.dart';
import 'package:holefeeder/core/view_models/screens/dashboard_view_model.dart';
import 'package:holefeeder/ui/widgets/account_list_tile.dart';
import 'package:holefeeder/ui/widgets/form_state_handler.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) => ViewModelProvider<DashboardViewModel>(
    create:
        (ctx) => DashboardViewModel(
          dataProvider: ctx.read<DataProvider>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder:
        (model) =>
            UniversalPlatform.isApple
                ? _buildForCupertino(context, model)
                : _buildForMaterial(context, model),
  );

  Widget _buildForCupertino(BuildContext context, DashboardViewModel model) =>
      CupertinoPageScaffold(
        navigationBar: CupertinoNavigationBar(
          middle: Text(LocalizationService.current.dashboard),
          trailing: IconButton(
            onPressed: () {
              context.push('/purchase');
            },
            icon: const Icon(CupertinoIcons.purchased),
          ),
        ),
        child: _buildScreen(context, model),
      );

  Widget _buildForMaterial(BuildContext context, DashboardViewModel model) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: _buildScreen(context, model),
    );
  }

  Widget _buildScreen(BuildContext context, DashboardViewModel model) {
    return FormStateHandler(
      formState: model.formState,
      builder:
          () => RefreshIndicator(
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
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: HolefeederWidgets.button(
                    onPressed: () => context.go('/settings'),
                    child: const Text('Go to Settings'),
                  ),
                ),
              ],
            ),
          ),
    );
  }
}
