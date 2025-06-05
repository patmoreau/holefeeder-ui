import 'dart:developer' as developper show log;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class TransactionListTile extends StatelessWidget {
  final Transaction transaction;

  const TransactionListTile({super.key, required this.transaction});

  @override
  Widget build(BuildContext context) => ViewModelProvider<TransactionViewModel>(
    create:
        (ctx) => TransactionViewModel(
          transaction: transaction,
          repository: ctx.read<TransactionRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder: (model) => _buildSwipeableTile(context, model),
  );

  Widget _buildSwipeableTile(BuildContext context, TransactionViewModel model) {
    final trailingActions = [
      SwipeAction(
        label: LocalizationService.current.deleteCashflow,
        icon: AdaptiveIcons.delete,
        color:
            UniversalPlatform.isApple ? CupertinoColors.systemRed : Colors.red,
        onTap:
            () => SwipeActionDialogs.showConfirmationDialog(
              context,
              title: LocalizationService.current.deleteCashflowTitle,
              message: LocalizationService.current.deleteCashflowMessage,
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
              developper.log(
                'TransactionListTile tapped: ${model.id}',
                name: 'TransactionListTile.Tile.onTap',
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
              leading: _buildLeadingContainer(model),
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

  Widget _buildLeadingContainer(TransactionViewModel model) => SizedBox(
    child: AdaptiveIconButton(
      onPressed: () {},
      icon: Icon(AdaptiveIcons.purchase, size: 28.0),
    ),
  );

  Widget _buildTitle(TransactionViewModel model) => LayoutBuilder(
    builder:
        (context, constraints) => Row(
          children: [
            Expanded(
              child: Text(
                model.description,
                style: const TextStyle(fontWeight: FontWeight.w600),
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
                LocalizationService.device.toLanguageTag(),
              ).format(model.date),
              style: const TextStyle(
                fontSize: 12,
                color: CupertinoColors.systemGrey,
              ),
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
