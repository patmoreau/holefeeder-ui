import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/platform.dart';
import 'package:holefeeder/presentation/widgets.dart';
import 'package:provider/provider.dart';

class AccountForm extends StatefulWidget {
  final AccountViewModel model;
  final GlobalKey<FormState> formKey;

  const AccountForm({super.key, required this.model, required this.formKey});

  @override
  State<AccountForm> createState() => _AccountFormState();
}

class _AccountFormState extends State<AccountForm> {
  @override
  Widget build(BuildContext context) => Consumer<AccountViewModel>(
    builder:
        (context, model, _) => Column(
          children: [
            _buildAccountCard(context, model),
            SizedBox(height: 16),
            AdaptiveSegmentedControl<ListType>(
              groupValue: model.selectedSegment,
              onValueChanged: (ListType? value) async {
                if (value != null) {
                  await model.setSegment(value);
                }
              },
              children: <ListType, Widget>{
                ListType.upcoming: Text(L10nService.current.upcoming),
                ListType.transactions: Text(L10nService.current.transactions),
              },
            ),
            SizedBox(height: 16),
            Expanded(
              child: RefreshIndicator.adaptive(
                onRefresh: () => model.refreshAccount(),
                child:
                    model.selectedSegment == ListType.upcoming
                        ? _buildUpcomingList(model)
                        : _buildTransactionList(model),
              ),
            ),
          ],
        ),
  );

  Widget _buildAccountCard(BuildContext context, AccountViewModel model) {
    final TextStyle titleStyle =
        Platform.isCupertino
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
          child: Text(L10nService.current.upcomingEmpty),
        ),
      );
    }

    return ListView.builder(
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
          child: Text(L10nService.current.transactionsEmpty),
        ),
      );
    }

    return ListView.builder(
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
      Platform.isCupertino
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
