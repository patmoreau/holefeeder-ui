import 'dart:developer' as developer;

import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_picker.dart';

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
    return AdaptivePicker<Account>(
      label: label ?? L10nService.current.fieldAccount,
      value: selectedAccount,
      items: accounts,
      displayStringFor: (account) => account.name,
      onChanged: onChanged,
      placeholder: L10nService.current.fieldAccountPlaceHolder,
      enabled: enabled,
    );
  }
}
