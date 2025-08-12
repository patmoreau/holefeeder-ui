import 'dart:developer' as developer show log;

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class TransactionListTile extends StatelessWidget {
  final Transaction transaction;

  const TransactionListTile({super.key, required this.transaction});

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<TransactionViewModel>(
        create:
            (context) => TransactionViewModel(
              transaction: transaction,
              repository: context.read<TransactionRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<TransactionViewModel>(
          builder:
              (context, model, child) => _buildSwipeableTile(context, model),
        ),
      );

  Widget _buildSwipeableTile(BuildContext context, TransactionViewModel model) {
    final trailingActions = [
      SwipeAction(
        label: L10nService.current.deleteCashflow,
        icon: AdaptiveIcons.delete,
        color: AppThemes.getDestructiveColor(context),
        onTap:
            () => SwipeActionDialogs.showConfirmationDialog(
              context,
              title: L10nService.current.deleteCashflowTitle,
              message: L10nService.current.deleteCashflowMessage,
              action: () => model.delete(),
            ),
        isDestructive: true,
      ),
    ];

    return SwipeableAdaptiveListTile(
      dismissibleKey: Key(model.id),
      trailingActions: trailingActions,
      child: _buildListTile(context, model),
    );
  }

  Widget _buildListTile(BuildContext context, TransactionViewModel model) =>
      Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AdaptivePressable(
            onTap: () {
              developer.log(
                'TransactionListTile tapped: ${model.id}',
                name: 'TransactionListTile',
              );
              context.push(
                '/modify-transaction',
                extra: model.formState.transaction,
              );
            },
            child: AdaptiveListTile(
              padding: const EdgeInsets.symmetric(
                horizontal: 8.0,
                vertical: 8.0,
              ),
              // onTap: () {},
              leading: _buildLeadingContainer(context, model),
              title: _buildTitle(model),
              subtitle: _buildSubtitle(model),
              trailing: _buildTrailing(model),
            ),
          ),
          const Padding(
            padding: EdgeInsets.only(left: 52.0),
            child: Divider(height: 1),
          ),
        ],
      );

  Widget _buildLeadingContainer(
    BuildContext context,
    TransactionViewModel model,
  ) {
    final color = AppThemes.getCategoryTypeColor(
      context,
      model.formState.transaction.category.type,
    );
    return SizedBox(
      child: AdaptiveIconButton(
        onPressed: () {},
        icon: Icon(AdaptiveIcons.purchase, size: 28.0, color: color),
      ),
    );
  }

  Widget _buildTitle(TransactionViewModel model) => LayoutBuilder(
    builder:
        (context, constraints) => Row(
          children: [
            Expanded(
              child: Text(
                model.description,
                style: AppThemes.getTitleTextStyle(context),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
  );

  Widget _buildSubtitle(TransactionViewModel model) => LayoutBuilder(
    builder:
        (context, constraints) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 2),
            Text(
              DateFormat.yMd(
                L10nService.device.toLanguageTag(),
              ).format(model.date),
              style: AppThemes.getSubtitleTextStyle(context),
            ),
          ],
        ),
  );

  Widget _buildTrailing(TransactionViewModel model) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CurrencyText(value: model.amount),
      const SizedBox(width: 8),
      const AdaptiveListTileChevron(),
    ],
  );
}
