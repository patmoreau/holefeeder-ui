import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/platform_picker_widget.dart';

class AccountPicker extends StatelessWidget {
  final List<Account> accounts;
  final Account? selectedAccount;
  final ValueChanged<Account?> onChanged;

  const AccountPicker({
    super.key,
    required this.accounts,
    required this.selectedAccount,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return PlatformPicker<Account>(
      label: LocalizationService.current.fieldAccount,
      value: selectedAccount,
      items: accounts,
      displayStringFor: (account) => account.name,
      onChanged: onChanged,
      placeholder: LocalizationService.current.fieldAccountPlaceHolder,
    );
  }
}
