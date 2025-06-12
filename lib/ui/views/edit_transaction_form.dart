import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/widgets/account_picker.dart';
import 'package:holefeeder/ui/widgets/amount_field.dart';
import 'package:holefeeder/ui/widgets/category_picker.dart';
import 'package:holefeeder/ui/widgets/date_picker_field.dart';
import 'package:holefeeder/ui/widgets/hashtag_selector.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';

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
      inputFieldHint: LocalizationService.current.fieldTagsPlaceHolder,
    ),
    AdaptiveTextField(
      labelText: LocalizationService.current.note,
      initialValue: model.note,
      onChanged: model.updateNote,
    ),
  ];
}
