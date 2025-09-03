import 'dart:developer' as developer;

import 'package:flutter/widgets.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';

import 'adaptive/adaptive_form_row.dart';
import 'adaptive/adaptive_picker.dart';

class AccountPicker extends StatelessWidget {
  final String? label;
  final List<Account> accounts;
  final Account? selectedAccount;
  final ValueChanged<Account?> onChanged;
  final bool enabled;
  static int _buildCount = 0;

  const AccountPicker({
    super.key,
    this.label,
    required this.accounts,
    required this.selectedAccount,
    required this.onChanged,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    _buildCount++;
    developer.log(
      'Building (count: $_buildCount) with ${accounts.length} accounts',
      name: 'AccountPicker',
    );
    // Don't render if we have no accounts to pick from
    if (accounts.isEmpty) {
      developer.log(
        'No accounts, returning empty widget',
        name: 'AccountPicker',
      );
      return const SizedBox.shrink();
    }

    developer.log('Rendering adaptive picker', name: 'AccountPicker');
    return AdaptiveFormRow(
      prefix: Text(label ?? L10nService.current.fieldAccount),
      child: AdaptivePicker<Account>(
        value: selectedAccount,
        items: accounts,
        displayStringFor: (account) => account.name,
        onChanged: onChanged,
        placeholder: L10nService.current.fieldAccountPlaceHolder,
        enabled: enabled,
      ),
    );
  }
}
