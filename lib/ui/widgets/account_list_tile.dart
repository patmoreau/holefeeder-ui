import 'package:decimal/decimal.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:universal_platform/universal_platform.dart';

class AccountListTile extends StatelessWidget {
  final Account account;

  const AccountListTile({super.key, required this.account});

  @override
  Widget build(BuildContext context) {
    final isPositiveBalance = account.balance.compareTo(Decimal.zero) >= 0;
    final icon = Icon(
      isPositiveBalance ? Icons.arrow_upward : Icons.arrow_downward,
      color: isPositiveBalance ? Colors.green : Colors.red,
    );

    if (UniversalPlatform.isApple) {
      return CupertinoListTile(
        title: Text(account.name),
        subtitle: Text(account.balance.toString()),
        trailing: icon,
      );
    }

    return ListTile(
      title: Text(account.name),
      subtitle: Text(account.balance.toString()),
      trailing: icon,
    );
  }
}
