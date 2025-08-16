import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/widgets.dart';

class PurchaseTransferForm extends StatelessWidget {
  final PurchaseViewModel model;
  final GlobalKey<FormState> formKey;

  const PurchaseTransferForm({
    super.key,
    required this.model,
    required this.formKey,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: ListView(
        primary: true, // Use the PrimaryScrollController
        padding: const EdgeInsets.all(16.0),
        children: [
          if (model.hasError)
            Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Text(
                model.error ?? L10nService.current.errorGeneric,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
          ..._buildFormSections(context),
          // Add some bottom padding to ensure the last item is visible
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  List<Widget> _buildFormSections(BuildContext context) => [
    AdaptiveFormSection(
      header: Text(
        L10nService.current.purchaseBasicDetails,
        style: AppThemes.getFormSectionHeaderTextStyle(context),
      ),
      children: _buildBasicFields(),
    ),
    AdaptiveFormSection(
      header: Text(
        L10nService.current.purchaseAdditionalDetails,
        style: AppThemes.getFormSectionHeaderTextStyle(context),
      ),
      children: _buildAdditionalFields(),
    ),
  ];

  List<Widget> _buildBasicFields() => [
    AmountField(
      initialValue: model.formState.amount,
      onChanged: model.updateAmount,
      autofocus: true,
    ),
    DatePickerField(
      selectedDate: model.formState.date,
      onDateChanged: model.updateDate,
    ),
    AccountPicker(
      label: L10nService.current.fieldAccountFrom,
      accounts: model.accounts,
      selectedAccount: model.formState.selectedFromAccount,
      onChanged: model.setSelectedFromAccount,
    ),
    AccountPicker(
      label: L10nService.current.fieldAccountTo,
      accounts: model.accounts,
      selectedAccount: model.formState.selectedToAccount,
      onChanged: model.setSelectedToAccount,
    ),
  ];

  List<Widget> _buildAdditionalFields() => [
    AdaptiveTextField(
      labelText: L10nService.current.note,
      initialValue: model.formState.note,
      onChanged: model.updateNote,
    ),
  ];
}
