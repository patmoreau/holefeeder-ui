import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/validators/validators.dart';
import 'package:holefeeder/core/view_models/screens/purchase_view_model.dart';
import 'package:holefeeder/ui/widgets/account_picker.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_text_field.dart';
import 'package:holefeeder/ui/widgets/amount_field.dart';
import 'package:holefeeder/ui/widgets/category_picker.dart';
import 'package:holefeeder/ui/widgets/date_picker_field.dart';
import 'package:holefeeder/ui/widgets/hashtag_selector.dart';
import 'package:holefeeder/ui/widgets/interval_type_picker_field.dart';
import 'package:universal_platform/universal_platform.dart';

class PurchaseForm extends StatelessWidget {
  final PurchaseViewModel model;
  final GlobalKey<FormState> formKey;

  const PurchaseForm({super.key, required this.model, required this.formKey});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: ListView(
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
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
          ...(UniversalPlatform.isApple
              ? _buildCupertinoForm()
              : _buildMaterialForm()),
        ],
      ),
    );
  }

  List<Widget> _buildCupertinoForm() {
    return [
      CupertinoFormSection.insetGrouped(
        header: Text(LocalizationService.current.purchaseBasicDetails),
        children: _buildBasicFields(),
      ),
      const SizedBox(height: 20), // Standard iOS spacing between sections
      CupertinoFormSection.insetGrouped(
        header: Text(LocalizationService.current.purchaseTagsDetails),
        children: _buildTagsFields(),
      ),
      const SizedBox(height: 20), // Standard iOS spacing between sections
      CupertinoFormSection.insetGrouped(
        header: Text(LocalizationService.current.purchaseCashflowDetails),
        children: _buildCashflowFields(),
      ),
    ];
  }

  List<Widget> _buildMaterialForm() {
    return [
      _buildFormSection(children: _buildBasicFields()),
      const SizedBox(height: 16), // Standard Material spacing
      if (model.formState.isCashflow)
        _buildFormSection(children: _buildCashflowFields()),
    ];
  }

  Widget _buildFormSection({required List<Widget> children}) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (var i = 0; i < children.length; i++) ...[
              children[i],
              if (i < children.length - 1)
                const SizedBox(
                  height: 16,
                ), // Standard spacing between form fields
            ],
          ],
        ),
      ),
    );
  }

  List<Widget> _buildBasicFields() => [
    AmountField(
      initialValue: model.formState.amount,
      onChanged: model.updateAmount,
    ),
    DatePickerField(
      selectedDate: model.formState.date,
      onDateChanged: model.updateDate,
    ),
    AccountPicker(
      accounts: model.accounts,
      selectedAccount: model.formState.selectedAccount,
      onChanged: model.setSelectedAccount,
    ),
    CategoryPicker(
      categories: model.categories,
      selectedCategory: model.formState.selectedCategory,
      onChanged: model.setSelectedCategory,
    ),
    AdaptiveTextField(
      labelText: LocalizationService.current.note,
      initialValue: model.formState.note,
      onChanged: model.updateNote,
    ),
  ];

  List<Widget> _buildTagsFields() => [
    HashtagSelector(
      availableHashtags: model.tags,
      initialHashtags: model.formState.tags,
      onHashtagsChanged: model.updateTags,
      allowSpaces: true,
      inputFieldHint: LocalizationService.current.fieldTagsPlaceHolder,
    ),
  ];

  List<Widget> _buildCashflowFields() => [
    UniversalPlatform.isApple
        ? CupertinoFormRow(
          prefix: Text(LocalizationService.current.fieldCashflow),
          child: CupertinoSwitch(
            value: model.formState.isCashflow,
            onChanged: model.updateIsCashflow,
          ),
        )
        : SwitchListTile(
          title: Text(LocalizationService.current.fieldCashflow),
          value: model.formState.isCashflow,
          onChanged: model.updateIsCashflow,
        ),
    if (model.formState.isCashflow)
      DatePickerField(
        selectedDate: model.formState.effectiveDate,
        onDateChanged: model.updateEffectiveDate,
      ),
    if (model.formState.isCashflow)
      IntervalTypePickerField(
        selectedIntervalType: model.formState.intervalType,
        onValueChanged: model.updateIntervalType,
      ),
    if (model.formState.isCashflow)
      AdaptiveTextField(
        labelText: LocalizationService.current.fieldFrequency,
        initialValue: model.formState.frequency.toString(),
        keyboardType: TextInputType.number,
        onChanged: (value) => model.updateFrequency(int.tryParse(value) ?? 1),
        validator: greatherThanZeroValueValidator(),
        textAlign: TextAlign.right,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      ),
    if (model.formState.isCashflow)
      AdaptiveTextField(
        labelText: LocalizationService.current.fieldRecurrence,
        initialValue: model.formState.recurrence.toString(),
        keyboardType: TextInputType.number,
        onChanged: (value) => model.updateRecurrence(int.tryParse(value) ?? 0),
        validator: positiveValueValidator(),
        textAlign: TextAlign.right,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      ),
  ];
}
