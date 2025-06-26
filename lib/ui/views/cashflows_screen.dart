import 'package:flutter/material.dart';
import 'package:holefeeder/core/repositories/cashflow_repository.dart';
import 'package:holefeeder/core/services/localization_service.dart';
import 'package:holefeeder/core/view_models/screens/cashflows_view_model.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/cashflow_list_tile.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

class CashflowsScreen extends StatelessWidget {
  const CashflowsScreen({super.key});

  @override
  Widget build(BuildContext context) => ViewModelProvider<CashflowsViewModel>(
    create:
        (ctx) => CashflowsViewModel(
          repository: ctx.read<CashflowRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder:
        (model) => FormStateHandler(
          formState: model.formState,
          builder:
              () => Column(
                children: [
                  AdaptiveSwitch(
                    label: LocalizationService.current.showInactive,
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
  );
}
