import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class UpcomingListTile extends StatelessWidget {
  final Upcoming upcoming;

  const UpcomingListTile({super.key, required this.upcoming});

  @override
  Widget build(BuildContext context) => ViewModelProvider<UpcomingViewModel>(
    create:
        (ctx) => UpcomingViewModel(
          upcoming: upcoming,
          repository: ctx.read<UpcomingRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder: (model) => _buildListTile(context, model),
  );

  Widget _buildListTile(BuildContext context, UpcomingViewModel model) =>
      Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AdaptiveListTile(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 16.0,
            ),
            // onTap: () {},
            leading: _buildLeadingContainer(model),
            title: _buildTitle(model),
            subtitle: _buildSubtitle(model),
            trailing: _buildTrailing(model),
          ),
          const Padding(
            padding: EdgeInsets.only(left: 24.0),
            child: Divider(height: 1),
          ),
        ],
      );

  Widget _buildLeadingContainer(UpcomingViewModel model) => SizedBox(
    width: 28,
    height: 28,
    child: AdaptiveIconButton(
      onPressed: () async => await model.pay(),
      icon: Icon(AdaptiveIcons.purchase),
    ),
  );

  Widget _buildTitle(UpcomingViewModel model) => LayoutBuilder(
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

  Widget _buildSubtitle(UpcomingViewModel model) => LayoutBuilder(
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

  Widget _buildTrailing(UpcomingViewModel model) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CurrencyText(value: model.amount),
      const SizedBox(width: 8),
      const AdaptiveListTileChevron(),
    ],
  );
}
