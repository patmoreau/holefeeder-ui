import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/view_models/screens/account_view_model.dart';
import 'package:holefeeder/ui/widgets/currency_text.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:universal_platform/universal_platform.dart';

class AccountListTile extends StatelessWidget {
  final AccountViewModel account;

  const AccountListTile({super.key, required this.account});

  String _formatDate(DateTime date) =>
      '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) => ViewModelProvider<AccountViewModel>(
    create: (ctx) => account,
    builder:
        (model) =>
            UniversalPlatform.isApple
                ? _buildForCupertino(context, model)
                : _buildForMaterial(context, model),
  );

  Widget _buildForCupertino(BuildContext context, AccountViewModel model) =>
      Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CupertinoListTile(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 16.0,
            ),
            onTap: () => context.push('/account', extra: model),
            leading: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: _cupertinoColor(),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  account.upcomingCashflowsCount.toString(),
                  style: const TextStyle(
                    color: CupertinoColors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    height: 1.0,
                  ),
                ),
              ),
            ),
            title: Row(
              children: [
                Text(
                  account.account.name,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                if (account.account.favorite) ...[
                  const SizedBox(width: 4),
                  const Icon(
                    CupertinoIcons.star_fill,
                    color: CupertinoColors.systemYellow,
                    size: 16,
                  ),
                ],
              ],
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CurrencyText(value: account.balance),
                const SizedBox(height: 2),
                Text(
                  'Last updated: ${_formatDate(account.account.updated)}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: CupertinoColors.systemGrey,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CurrencyText(value: account.projection),
                const SizedBox(width: 8),
                const CupertinoListTileChevron(),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 24.0),
            child: const Divider(height: 1),
          ),
        ],
      );

  Widget _buildForMaterial(BuildContext context, AccountViewModel model) =>
      Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 16.0,
            ),
            onTap: () => context.push('/account', extra: model),
            leading: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: _materialColor(),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  account.upcomingCashflowsCount.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    height: 1.0,
                  ),
                ),
              ),
            ),
            title: Row(
              children: [
                Text(
                  account.account.name,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                if (account.account.favorite) ...[
                  const SizedBox(width: 4),
                  const Icon(Icons.star, color: Colors.amber, size: 16),
                ],
              ],
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CurrencyText(value: account.balance),
                const SizedBox(height: 2),
                Text(
                  'Last updated: ${_formatDate(account.account.updated)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CurrencyText(value: account.projection),
                const SizedBox(width: 8),
                const Icon(Icons.chevron_right),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 24.0),
            child: const Divider(height: 1),
          ),
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
