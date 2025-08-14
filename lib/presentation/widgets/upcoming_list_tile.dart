import 'dart:developer' as developper show log;

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/platform.dart';
import 'package:holefeeder/presentation/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'adaptive.dart';
import 'currency_text.dart';

class UpcomingListTile extends StatelessWidget {
  final Upcoming upcoming;

  const UpcomingListTile({super.key, required this.upcoming});

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<UpcomingViewModel>(
        create:
            (context) => UpcomingViewModel(
              upcoming: upcoming,
              repository: context.read<UpcomingRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<UpcomingViewModel>(
          builder:
              (context, model, child) => _buildSwipeableTile(context, model),
        ),
      );

  Widget _buildSwipeableTile(BuildContext context, UpcomingViewModel model) {
    final leadingActions = [
      SwipeAction(
        label: L10nService.current.cancelUpcoming,
        icon: AdaptiveIcons.cancel,
        color: AppThemes.getSystemBlueColor(context),
        onTap:
            () => SwipeActionDialogs.showConfirmationDialog(
              context,
              title: L10nService.current.cancelUpcomingTitle,
              message: L10nService.current.cancelUpcomingMessage,
              action: () => model.cancel(),
            ),
      ),
    ];

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
      dismissibleKey: Key(model.formState.upcoming.id),
      leadingActions: leadingActions,
      trailingActions: trailingActions,
      child: _buildListTile(context, model),
    );
  }

  Widget _buildListTile(
    BuildContext context,
    UpcomingViewModel model,
  ) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      AdaptivePressable(
        onTap: () {
          developper.log(
            'UpcomingListTile tapped: ${model.formState.upcoming.id}',
            name: 'UpcomingListTile.Tile.onTap',
          );
          context.push('/pay', extra: model.formState.upcoming);
        },
        child: AdaptiveListTile(
          padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
          leading: _buildLeadingContainer(context, model),
          title: _buildTitle(model),
          subtitle: _buildSubtitle(model),
          trailing: _buildTrailing(model),
        ),
      ),
      Padding(
        padding: const EdgeInsets.only(left: 52.0),
        child: Divider(height: 1, thickness: Platform.isCupertino ? 0.5 : 1.0),
      ),
    ],
  );

  Widget _buildLeadingContainer(
    BuildContext context,
    UpcomingViewModel model,
  ) => GestureDetector(
    onTap: () async {
      developper.log(
        'Leading Container onTap: ${model.formState.upcoming.id}',
        name: 'UpcomingListTile.Leading.onTap',
      );
      await model.pay();
    },
    behavior: HitTestBehavior.opaque,
    child: Container(
      width: 52.0,
      height: 52.0,
      alignment: Alignment.center,
      child: Icon(
        AdaptiveIcons.purchase,
        size: 28.0,
        color: AppThemes.getPrimaryColor(context),
      ),
    ),
  );

  Widget _buildTitle(UpcomingViewModel model) => LayoutBuilder(
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

  Widget _buildSubtitle(UpcomingViewModel model) => LayoutBuilder(
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

  Widget _buildTrailing(UpcomingViewModel model) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CurrencyText(value: model.amount),
      const SizedBox(width: 8),
      const AdaptiveListTileChevron(),
    ],
  );
}
