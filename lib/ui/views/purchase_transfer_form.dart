import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/screens/purchase_view_model.dart';
import 'package:holefeeder/ui/widgets/account_picker.dart';
import 'package:holefeeder/ui/widgets/amount_field.dart';
import 'package:holefeeder/ui/widgets/date_picker_field.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';

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
                model.error ?? LocalizationService.current.errorGeneric,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
          ..._buildFormSections(),
          // Add some bottom padding to ensure the last item is visible
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  List<Widget> _buildFormSections() => [
    AdaptiveFormSection(
      header: LocalizationService.current.purchaseBasicDetails,
      children: _buildBasicFields(),
    ),
    const SizedBox(height: 16),
    AdaptiveFormSection(
      header: LocalizationService.current.purchaseAdditionalDetails,
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
      label: LocalizationService.current.fieldAccountFrom,
      accounts: model.accounts,
      selectedAccount: model.formState.selectedFromAccount,
      onChanged: model.setSelectedFromAccount,
    ),
    AccountPicker(
      label: LocalizationService.current.fieldAccountTo,
      accounts: model.accounts,
      selectedAccount: model.formState.selectedToAccount,
      onChanged: model.setSelectedToAccount,
    ),
  ];

  List<Widget> _buildAdditionalFields() => [
    AdaptiveTextField(
      labelText: LocalizationService.current.note,
      initialValue: model.formState.note,
      onChanged: model.updateNote,
    ),
  ];
}
