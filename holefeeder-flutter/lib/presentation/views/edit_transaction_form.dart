import 'package:flutter/material.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/widgets.dart';

class EditTransactionForm extends StatelessWidget {
  final EditTransactionViewModel model;
  final GlobalKey<FormState> formKey;

  const EditTransactionForm({
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
      initialValue: model.amount,
      onChanged: model.updateAmount,
      autofocus: true,
    ),
    DatePickerField(selectedDate: model.date, onDateChanged: model.updateDate),
    AccountPicker(
      accounts: model.accounts,
      selectedAccount: model.selectedAccount,
      onChanged: model.setSelectedAccount,
    ),
    CategoryPicker(
      categories: model.categories,
      selectedCategory: model.selectedCategory,
      onChanged: model.setSelectedCategory,
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
}
