import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/services.dart';
import 'package:holefeeder/presentation/widgets.dart';
import 'package:provider/provider.dart';

class CashflowsScreen extends StatelessWidget {
  const CashflowsScreen({super.key});

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<CashflowsViewModel>(
        create:
            (context) => CashflowsViewModel(
              repository: context.read<CashflowRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<CashflowsViewModel>(
          builder:
              (context, model, child) => FormStateHandler(
                formState: model.formState,
                builder:
                    () => Column(
                      children: [
                        AdaptiveSwitch(
                          label: L10nService.current.showInactive,
                          value: model.showInactive,
                          onChanged: model.setShowInactive,
                        ),
                        SizedBox(height: 16),
                        Expanded(
                          child: RefreshIndicator.adaptive(
                            onRefresh: model.refreshCashflows,
                            child: ListView(
                              children: [
                                if (model.cashflows.isEmpty)
                                  const Center(
                                    child: Padding(
                                      padding: EdgeInsets.all(16.0),
                                      child: Text('No accounts found'),
                                    ),
                                  )
                                else
                                  ...model.cashflows.map(
                                    (cashflow) => CashflowListTile(
                                      key: ValueKey(
                                        '${cashflow.id}-${cashflow.hashCode}',
                                      ),
                                      cashflow: cashflow,
                                    ),
                                  ),
                                const SizedBox(height: 16),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
              ),
        ),
      );
}
