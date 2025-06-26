import 'dart:developer' as developer show log;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class CashflowListTile extends StatelessWidget {
  final Cashflow cashflow;

  const CashflowListTile({super.key, required this.cashflow});

  @override
  Widget build(BuildContext context) => ViewModelProvider<CashflowViewModel>(
    create:
        (ctx) => CashflowViewModel(
          cashflow: cashflow,
          repository: ctx.read<CashflowRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder: (model) => _buildSwipeableTile(context, model),
  );

  Widget _buildSwipeableTile(BuildContext context, CashflowViewModel model) {
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

  Widget _buildListTile(BuildContext context, CashflowViewModel model) =>
      Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AdaptivePressable(
            onTap: () {
              developer.log(
                'CashflowListTile tapped: ${model.id}',
                name: 'CashflowListTile',
              );
              context.push('/modify-cashflow', extra: model.formState.cashflow);
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

  Widget _buildLeadingContainer(CashflowViewModel model) => SizedBox(
    child: AdaptiveIconButton(
      onPressed: () {},
      icon: _getDateIntervalIcon(
        model.formState.cashflow.intervalType,
        model.formState.cashflow.inactive,
      ),
    ),
  );

  Icon _getDateIntervalIcon(DateIntervalType intervalType, bool isInactive) {
    final color = isInactive ? Colors.grey : null;

    switch (intervalType) {
      case DateIntervalType.weekly:
        return Icon(AdaptiveIcons.weekly, size: 28.0, color: color);
      case DateIntervalType.monthly:
        return Icon(AdaptiveIcons.monthly, size: 28.0, color: color);
      case DateIntervalType.yearly:
        return Icon(AdaptiveIcons.yearly, size: 28.0, color: color);
      case DateIntervalType.oneTime:
        return Icon(AdaptiveIcons.one_time, size: 28.0, color: color);
    }
  }

  Widget _buildTitle(CashflowViewModel model) => LayoutBuilder(
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

  Widget _buildSubtitle(CashflowViewModel model) => LayoutBuilder(
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

  Widget _buildTrailing(CashflowViewModel model) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CurrencyText(value: model.amount),
      const SizedBox(width: 8),
      const AdaptiveListTileChevron(),
    ],
  );
}
