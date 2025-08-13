import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/platform.dart';
import 'package:holefeeder/presentation.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class AccountListTile extends StatelessWidget {
  final Account account;

  const AccountListTile({super.key, required this.account});

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<AccountViewModel>(
        create:
            (context) => AccountViewModel(
              accountId: account.id,
              accountRepository: context.read<AccountRepository>(),
              upcomingRepository: context.read<UpcomingRepository>(),
              transactionRepository: context.read<TransactionRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<AccountViewModel>(
          builder: (context, model, child) => _buildListTile(context, model),
        ),
      );

  Widget _buildListTile(BuildContext context, AccountViewModel model) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      AdaptiveListTile(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        onTap: () => context.push('/account', extra: model.account),
        leading: _buildLeadingContainer(context, model),
        title: _buildTitle(context, model),
        subtitle: _buildSubtitle(context, model),
        trailing: _buildTrailing(model),
      ),
      Padding(
        padding: const EdgeInsets.only(left: 60.0),
        child: Divider(height: 1, thickness: Platform.isCupertino ? 0.5 : null),
      ),
    ],
  );

  Widget _buildLeadingContainer(BuildContext context, AccountViewModel model) =>
      Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: _getContainerColor(context, model),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text(
            model.upcomingCashflowsCount.toString(),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w600,
              height: 1.0,
            ),
          ),
        ),
      );

  Widget _buildTitle(BuildContext context, AccountViewModel model) => Row(
    children: [
      Expanded(
        child: Text(
          model.account.name,
          style: AppThemes.getTitleTextStyle(context),
          overflow: TextOverflow.ellipsis,
        ),
      ),
      if (model.account.favorite) ...[
        const SizedBox(width: 6),
        Icon(
          Platform.isCupertino ? CupertinoIcons.star_fill : Icons.star,
          color: AppThemes.getWarningColor(context),
          size: 18,
        ),
      ],
    ],
  );

  Widget _buildSubtitle(BuildContext context, AccountViewModel model) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SizedBox(height: 4),
      CurrencyText(value: account.balance),
      const SizedBox(height: 4),
      Text(
        '${L10nService.current.lastUpdated}: ${DateFormat.yMd(L10nService.device.toLanguageTag()).format(model.account.updated)}',
        style: AppThemes.getSubtitleTextStyle(
          context,
        ).copyWith(fontStyle: FontStyle.italic),
        overflow: TextOverflow.ellipsis,
      ),
    ],
  );

  Widget _buildTrailing(AccountViewModel model) => Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      CurrencyText(value: model.projection),
      const SizedBox(height: 4),
      const AdaptiveListTileChevron(),
    ],
  );

  Color _getContainerColor(BuildContext context, AccountViewModel model) {
    return AppThemes.getProjectionColor(
      context,
      model.projectionType.toDouble(),
    );
  }
}
