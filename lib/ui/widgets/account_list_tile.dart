import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/notification_provider.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

class AccountListTile extends StatelessWidget {
  final Account account;

  const AccountListTile({super.key, required this.account});

  @override
  Widget build(BuildContext context) => ViewModelProvider<AccountViewModel>(
    create:
        (ctx) => AccountViewModel(
          accountId: account.id,
          accountRepository: ctx.read<AccountRepository>(),
          upcomingRepository: ctx.read<UpcomingRepository>(),
          transactionRepository: ctx.read<TransactionRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder: (model) => _buildListTile(context, model),
  );

  Widget _buildListTile(BuildContext context, AccountViewModel model) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      AdaptiveListTile(
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
        onTap: () => context.push('/account', extra: model.account),
        leading: _buildLeadingContainer(model),
        title: _buildTitle(model),
        subtitle: _buildSubtitle(model),
        trailing: _buildTrailing(model),
      ),
      const Padding(
        padding: EdgeInsets.only(left: 52.0),
        child: Divider(height: 1),
      ),
    ],
  );

  Widget _buildLeadingContainer(AccountViewModel model) => Container(
    width: 28,
    height: 28,
    decoration: BoxDecoration(
      color:
          UniversalPlatform.isApple
              ? _cupertinoColor(model)
              : _materialColor(model),
      shape: BoxShape.circle,
    ),
    child: Center(
      child: Text(
        model.upcomingCashflowsCount.toString(),
        style: TextStyle(
          color:
              UniversalPlatform.isApple ? CupertinoColors.white : Colors.white,
          fontSize: 13,
          fontWeight: FontWeight.w600,
          height: 1.0,
        ),
      ),
    ),
  );

  Widget _buildTitle(AccountViewModel model) => LayoutBuilder(
    builder:
        (context, constraints) => Row(
          children: [
            Expanded(
              child: Text(
                model.account.name,
                style: const TextStyle(fontWeight: FontWeight.w600),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (model.account.favorite) ...[
              const SizedBox(width: 4),
              Icon(
                UniversalPlatform.isApple
                    ? CupertinoIcons.star_fill
                    : Icons.star,
                color:
                    UniversalPlatform.isApple
                        ? CupertinoColors.systemYellow
                        : Colors.amber,
                size: 16,
              ),
            ],
          ],
        ),
  );

  Widget _buildSubtitle(AccountViewModel model) => LayoutBuilder(
    builder:
        (context, constraints) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CurrencyText(value: account.balance),
            const SizedBox(height: 2),
            Text(
              '${LocalizationService.current.lastUpdated}: ${DateFormat.yMd(LocalizationService.device.toLanguageTag()).format(model.account.updated)}',
              style: TextStyle(
                fontSize: 12,
                color:
                    UniversalPlatform.isApple
                        ? CupertinoColors.systemGrey
                        : Colors.grey.shade600,
                fontStyle: FontStyle.italic,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
  );

  Widget _buildTrailing(AccountViewModel model) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CurrencyText(value: model.projection),
      const SizedBox(width: 8),
      const AdaptiveListTileChevron(),
    ],
  );

  CupertinoDynamicColor _cupertinoColor(AccountViewModel model) {
    final projectionType = model.projectionType;
    if (projectionType == 0) {
      return CupertinoColors.systemGrey;
    } else if (projectionType > 0) {
      return CupertinoColors.systemGreen;
    } else {
      return CupertinoColors.systemRed;
    }
  }

  MaterialColor _materialColor(AccountViewModel model) {
    final projectionType = model.projectionType;
    if (projectionType == 0) {
      return Colors.grey;
    } else if (projectionType > 0) {
      return Colors.green;
    } else {
      return Colors.red;
    }
  }
}
