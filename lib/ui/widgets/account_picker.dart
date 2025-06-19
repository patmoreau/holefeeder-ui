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
  static int _buildCount = 0;

  const AccountPicker({
    super.key,
    this.label,
    required this.accounts,
    required this.selectedAccount,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    _buildCount++;
    developer.log(
      '[AccountPicker] Building (count: $_buildCount) with ${accounts.length} accounts',
    );
    // Don't render if we have no accounts to pick from
    if (accounts.isEmpty) {
      developer.log('[AccountPicker] No accounts, returning empty widget');
      return const SizedBox.shrink();
    }

    developer.log('[AccountPicker] Rendering adaptive picker');
    return AdaptivePicker<Account>(
      label: label ?? LocalizationService.current.fieldAccount,
      value: selectedAccount,
      items: accounts,
      displayStringFor: (account) => account.name,
      onChanged: onChanged,
      placeholder: LocalizationService.current.fieldAccountPlaceHolder,
    );
  }
}
