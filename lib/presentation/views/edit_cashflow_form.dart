import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/widgets.dart';

class EditCashflowForm extends StatelessWidget {
  final EditCashflowViewModel model;
  final GlobalKey<FormState> formKey;

  const EditCashflowForm({
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
          ..._buildFormSections(),
          // Add some bottom padding to ensure the last item is visible
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  List<Widget> _buildFormSections() => [
    AdaptiveFormSection(
      header: L10nService.current.purchaseBasicDetails,
      children: _buildBasicFields(),
    ),
    const SizedBox(height: 16),
    AdaptiveFormSection(
      header: L10nService.current.purchaseAdditionalDetails,
      children: _buildAdditionalFields(),
    ),
    const SizedBox(height: 16),
    AdaptiveFormSection(
      header: L10nService.current.purchaseCashflowDetails,
      children: _buildCashflowFields(),
    ),
  ];

  List<Widget> _buildBasicFields() => [
    AmountField(
      initialValue: model.amount,
      onChanged: model.updateAmount,
      autofocus: true,
    ),
    DatePickerField(selectedDate: model.date, onDateChanged: model.updateDate),
    AccountPicker(
      accounts: model.accounts,
      selectedAccount: model.selectedAccount,
      onChanged: model.setSelectedAccount,
      enabled: false,
    ),
    CategoryPicker(
      categories: model.categories,
      selectedCategory: model.selectedCategory,
      onChanged: model.setSelectedCategory,
      enabled: false,
    ),
  ];

  List<Widget> _buildAdditionalFields() => [
    HashtagSelector(
      availableHashtags: model.availableTags,
      initialHashtags: model.tags,
      onHashtagsChanged: model.updateTags,
      allowSpaces: true,
      inputFieldHint: L10nService.current.fieldTagsPlaceHolder,
    ),
    AdaptiveTextField(
      labelText: L10nService.current.note,
      initialValue: model.note,
      onChanged: model.updateNote,
    ),
  ];

  List<Widget> _buildCashflowFields() => [
    IntervalTypePickerField(
      selectedIntervalType: model.formState.intervalType,
      onValueChanged: (value) => {},
      enabled: false,
    ),
    AdaptiveTextField(
      labelText: L10nService.current.fieldFrequency,
      initialValue: model.formState.frequency.toString(),
      keyboardType: TextInputType.number,
      onChanged: (value) => {},
      validator: greatherThanZeroValueValidator(),
      textAlign: TextAlign.right,
      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      readOnly: true,
      enabled: false,
    ),
    AdaptiveTextField(
      labelText: L10nService.current.fieldRecurrence,
      initialValue: model.formState.recurrence.toString(),
      keyboardType: TextInputType.number,
      onChanged: (value) => {},
      validator: zeroOrPositiveValueValidator(),
      textAlign: TextAlign.right,
      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      readOnly: true,
      enabled: false,
    ),
  ];
}
