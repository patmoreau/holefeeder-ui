import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';
import 'package:universal_platform/universal_platform.dart';

enum ListType { upcoming, transactions }

class AccountForm extends StatefulWidget {
  final AccountViewModel model;
  final GlobalKey<FormState> formKey;

  const AccountForm({super.key, required this.model, required this.formKey});

  @override
  State<AccountForm> createState() => _AccountFormState();
}

class _AccountFormState extends State<AccountForm> {
  ListType _selectedSegment = ListType.upcoming;

  @override
  Widget build(BuildContext context) => Consumer<AccountViewModel>(
    builder:
        (context, model, _) => Column(
          children: [
            _buildAccountCard(context, model),
            SizedBox(height: 16),
            CupertinoSlidingSegmentedControl<ListType>(
              groupValue: _selectedSegment,
              onValueChanged: (ListType? value) {
                if (value != null) {
                  setState(() {
                    _selectedSegment = value;
                  });
                }
              },
              children: <ListType, Widget>{
                ListType.upcoming: Text(LocalizationService.current.upcoming),
                ListType.transactions: Text(
                  LocalizationService.current.transactions,
                ),
              },
            ),
            Expanded(
              child:
                  _selectedSegment == ListType.upcoming
                      ? _buildUpcomingList(model)
                      : _buildTransactionList(model),
            ),
          ],
        ),
  );

  Widget _buildAccountCard(BuildContext context, AccountViewModel model) {
    final TextStyle titleStyle =
        UniversalPlatform.isApple
            ? CupertinoTheme.of(context).textTheme.navLargeTitleTextStyle
            : Theme.of(context).textTheme.headlineLarge ??
                const TextStyle(fontSize: 34, fontWeight: FontWeight.bold);

    return Container(
      color: _backgroundColor(model),
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 58,
            child: Row(
              children: [
                Text(
                  model.account.name,
                  style: titleStyle,
                  softWrap: true,
                  overflow: TextOverflow.ellipsis,
                ),
                if (model.account.favorite) ...[
                  const SizedBox(width: 4),
                  const Icon(
                    CupertinoIcons.star_fill,
                    color: CupertinoColors.systemYellow,
                    size: 16,
                  ),
                ],
              ],
            ),
          ),
          SizedBox(
            height: 48,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CurrencyText(
                      value: model.balance,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const Spacer(),
                    CurrencyText(
                      value: model.projection,
                      style: const TextStyle(fontSize: 18),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUpcomingList(AccountViewModel model) {
    if (model.upcoming.isEmpty) {
      return Center(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(LocalizationService.current.upcomingEmpty),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: model.upcoming.length + 1, // +1 for bottom padding
      itemBuilder: (context, index) {
        if (index == model.upcoming.length) {
          return const SizedBox(height: 16); // Bottom padding
        }
        return UpcomingListTile(
          key: ValueKey(model.upcoming[index].id),
          // Add a key if your model has an ID
          upcoming: model.upcoming[index],
        );
      },
    );
  }

  Widget _buildTransactionList(AccountViewModel model) {
    if (model.transactions.isEmpty) {
      return Center(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(LocalizationService.current.transactionsEmpty),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: model.transactions.length + 1, // +1 for bottom padding
      itemBuilder: (context, index) {
        if (index == model.transactions.length) {
          return const SizedBox(height: 16); // Bottom padding
        }
        return TransactionListTile(
          key: ValueKey(model.transactions[index].id),
          // Add a key if your model has an ID
          transaction: model.transactions[index],
        );
      },
    );
  }

  Color _backgroundColor(AccountViewModel model) =>
      UniversalPlatform.isApple
          ? (model.projectionType == 0
              ? CupertinoColors.systemGrey6
              : (model.projectionType > 0
                  ? CupertinoColors.systemGreen.withOpacity(0.1)
                  : CupertinoColors.systemRed.withOpacity(0.1)))
          : (model.projectionType == 0
              ? Colors.grey.shade100
              : (model.projectionType > 0
                  ? Colors.green.shade50
                  : Colors.red.shade50));
}
