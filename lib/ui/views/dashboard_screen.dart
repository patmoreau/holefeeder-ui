import 'package:decimal/decimal.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/providers/notification_provider.dart';
import 'package:holefeeder/core/view_models/screens/dashboard_view_model.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) => ViewModelProvider<DashboardViewModel>(
    model: DashboardViewModel(
      dataProvider: context.read<DataProvider>(),
      notificationService: NotificationServiceProvider.of(context),
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
          middle: const Text('Dashboard'),
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
    if (model.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (model.hasError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              model.error ?? 'An error occurred',
              style: const TextStyle(color: Colors.red),
            ),
            const SizedBox(height: 16),
            HolefeederWidgets.button(
              onPressed: model.loadDashboardData,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
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
            ...model.accounts
                .map(
                  (account) => ListTile(
                    title: Text(account.name),
                    subtitle: Text(account.balance.toString()),
                    trailing: Icon(
                      account.balance.compareTo(Decimal.zero) >= 0
                          ? Icons.arrow_upward
                          : Icons.arrow_downward,
                      color:
                          account.balance.compareTo(Decimal.zero) >= 0
                              ? Colors.green
                              : Colors.red,
                    ),
                  ),
                )
                .toList(),
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
    );
  }
}
