import 'dart:developer' as developer;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/widgets.dart';

class PurchaseForm extends StatelessWidget {
  final PurchaseViewModel model;
  final GlobalKey<FormState> formKey;
  static int _buildCount = 0;

  const PurchaseForm({super.key, required this.model, required this.formKey});

  @override
  Widget build(BuildContext context) {
    _buildCount++;
    developer.log(
      'Building (count: $_buildCount) with ${model.accounts.length} accounts, ${model.categories.length} categories',
      name: 'PurchaseForm',
    );
    developer.log(
      'Model hasError: ${model.hasError}, error: ${model.error}',
      name: 'PurchaseForm',
    );
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
          // Only render the form if we have the basic data loaded
          if (model.accounts.isNotEmpty || model.categories.isNotEmpty)
            ..._buildFormSections()
          else
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: Text('Loading form data...'),
              ),
            ),
          // Add some bottom padding to ensure the last item is visible
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  List<Widget> _buildFormSections() {
    developer.log('Building form sections', name: 'PurchaseForm');
    final sections = [
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
    developer.log('Form sections built successfully', name: 'PurchaseForm');
    return sections;
  }

  List<Widget> _buildBasicFields() {
    developer.log('Building basic fields', name: 'PurchaseForm');
    final fields = [
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
        accounts: model.accounts,
        selectedAccount: model.formState.selectedFromAccount,
        onChanged: model.setSelectedFromAccount,
      ),
      CategoryPicker(
        categories: model.categories,
        selectedCategory: model.formState.selectedCategory,
        onChanged: model.setSelectedCategory,
      ),
    ];
    developer.log('Basic fields built successfully', name: 'PurchaseForm');
    return fields;
  }

  List<Widget> _buildAdditionalFields() => [
    HashtagSelector(
      availableHashtags: model.tags,
      initialHashtags: model.formState.tags,
      onHashtagsChanged: model.updateTags,
      allowSpaces: true,
      inputFieldHint: L10nService.current.fieldTagsPlaceHolder,
    ),
    AdaptiveTextField(
      labelText: L10nService.current.note,
      initialValue: model.formState.note,
      onChanged: model.updateNote,
    ),
  ];

  List<Widget> _buildCashflowFields() => [
    AdaptiveSwitch(
      label: L10nService.current.fieldCashflow,
      value: model.formState.isCashflow,
      onChanged: model.updateIsCashflow,
    ),
    if (model.formState.isCashflow) ...[
      DatePickerField(
        selectedDate: model.formState.effectiveDate,
        onDateChanged: model.updateEffectiveDate,
      ),
      IntervalTypePickerField(
        selectedIntervalType: model.formState.intervalType,
        onValueChanged: model.updateIntervalType,
      ),
      AdaptiveTextField(
        labelText: L10nService.current.fieldFrequency,
        initialValue: model.formState.frequency.toString(),
        keyboardType: TextInputType.number,
        onChanged: (value) => model.updateFrequency(int.tryParse(value) ?? 1),
        validator: greatherThanZeroValueValidator(),
        textAlign: TextAlign.right,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      ),
      AdaptiveTextField(
        labelText: L10nService.current.fieldRecurrence,
        initialValue: model.formState.recurrence.toString(),
        keyboardType: TextInputType.number,
        onChanged: (value) => model.updateRecurrence(int.tryParse(value) ?? 0),
        validator: zeroOrPositiveValueValidator(),
        textAlign: TextAlign.right,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      ),
    ],
  ];
}
