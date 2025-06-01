import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_picker.dart';

class AccountPicker extends StatelessWidget {
  final String? label;
  final List<Account> accounts;
  final Account? selectedAccount;
  final ValueChanged<Account?> onChanged;

  const AccountPicker({
    super.key,
    this.label,
    required this.accounts,
    required this.selectedAccount,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) => AdaptivePicker<Account>(
    label: label ?? LocalizationService.current.fieldAccount,
    value: selectedAccount,
    items: accounts,
    displayStringFor: (account) => account.name,
    onChanged: onChanged,
    placeholder: LocalizationService.current.fieldAccountPlaceHolder,
  );
}
