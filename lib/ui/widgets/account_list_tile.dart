import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/screens/account_view_model.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:universal_platform/universal_platform.dart';

class AccountListTile extends StatelessWidget {
  final AccountViewModel account;

  const AccountListTile({super.key, required this.account});

  @override
  Widget build(BuildContext context) => ViewModelProvider<AccountViewModel>(
    create: (ctx) => account,
    builder: (model) => _buildListTile(context, model),
  );

  Widget _buildListTile(BuildContext context, AccountViewModel model) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      AdaptiveListTile(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        onTap: () => context.push('/account', extra: model),
        leading: _buildLeadingContainer(),
        title: _buildTitle(),
        subtitle: _buildSubtitle(),
        trailing: _buildTrailing(),
      ),
      const Padding(
        padding: EdgeInsets.only(left: 24.0),
        child: Divider(height: 1),
      ),
    ],
  );

  Widget _buildLeadingContainer() => Container(
    width: 28,
    height: 28,
    decoration: BoxDecoration(
      color: UniversalPlatform.isApple ? _cupertinoColor() : _materialColor(),
      shape: BoxShape.circle,
    ),
    child: Center(
      child: Text(
        account.upcomingCashflowsCount.toString(),
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

  Widget _buildTitle() => LayoutBuilder(
    builder:
        (context, constraints) => Row(
          children: [
            Expanded(
              child: Text(
                account.account.name,
                style: const TextStyle(fontWeight: FontWeight.w600),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (account.account.favorite) ...[
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

  Widget _buildSubtitle() => LayoutBuilder(
    builder:
        (context, constraints) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CurrencyText(value: account.balance),
            const SizedBox(height: 2),
            Text(
              '${LocalizationService.current.lastUpdated}: ${DateFormat.yMd(LocalizationService.device.toLanguageTag()).format(account.account.updated)}',
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

  Widget _buildTrailing() => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      CurrencyText(value: account.projection),
      const SizedBox(width: 8),
      const AdaptiveListTileChevron(),
    ],
  );

  CupertinoDynamicColor _cupertinoColor() {
    final projectionType = account.projectionType;
    if (projectionType == 0) {
      return CupertinoColors.systemGrey;
    } else if (projectionType > 0) {
      return CupertinoColors.systemGreen;
    } else {
      return CupertinoColors.systemRed;
    }
  }

  MaterialColor _materialColor() {
    final projectionType = account.projectionType;
    if (projectionType == 0) {
      return Colors.grey;
    } else if (projectionType > 0) {
      return Colors.green;
    } else {
      return Colors.red;
    }
  }
}
