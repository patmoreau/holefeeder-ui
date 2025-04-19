import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/screens/purchase_view_model.dart';
import 'package:holefeeder/ui/widgets/account_picker.dart';
import 'package:holefeeder/ui/widgets/amount_field.dart';
import 'package:holefeeder/ui/widgets/category_picker.dart';
import 'package:holefeeder/ui/widgets/date_picker_field.dart';
import 'package:holefeeder/ui/widgets/platform_tag_selector.dart';
import 'package:holefeeder/ui/widgets/platform_text_field.dart';
import 'package:universal_platform/universal_platform.dart';

import 'package:holefeeder/core/enums/date_interval_type_enum.dart';

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
                model.error ?? 'An error occurred',
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
        header: const Text('Basic Information'),
        children: _buildBasicFields(),
      ),
      const SizedBox(height: 20), // Standard iOS spacing between sections
      if (model.formState.isCashflow)
        CupertinoFormSection.insetGrouped(
          header: const Text('Cashflow Details'),
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
    PlatformTextField(
      labelText: LocalizationService.current.note,
      initialValue: model.formState.note,
      onChanged: model.updateNote,
    ),
    PlatformTagSelector(
      allTags: model.tags,
      selectedTags: model.formState.tags,
      onTagsChanged: model.updateTags,
    ),
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
  ];

  List<Widget> _buildCashflowFields() => [
    DatePickerField(
      selectedDate: model.formState.effectiveDate,
      onDateChanged: model.updateEffectiveDate,
    ),
    UniversalPlatform.isApple
        ? CupertinoFormRow(
          prefix: Text(LocalizationService.current.fieldIntervalType),
          child: CupertinoSlidingSegmentedControl<DateIntervalType>(
            groupValue: model.formState.intervalType,
            onValueChanged: model.updateIntervalType,
            children: {
              DateIntervalType.weekly: Text(
                LocalizationService.current.intervalTypeWeekly,
              ),
              DateIntervalType.monthly: Text(
                LocalizationService.current.intervalTypeMonthly,
              ),
              DateIntervalType.yearly: Text(
                LocalizationService.current.intervalTypeYearly,
              ),
              DateIntervalType.oneTime: Text(
                LocalizationService.current.intervalTypeOneTime,
              ),
            },
          ),
        )
        : Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(LocalizationService.current.fieldIntervalType),
            SegmentedButton<DateIntervalType>(
              segments: [
                ButtonSegment(
                  value: DateIntervalType.weekly,
                  label: Text(LocalizationService.current.intervalTypeWeekly),
                ),
                ButtonSegment(
                  value: DateIntervalType.monthly,
                  label: Text(LocalizationService.current.intervalTypeMonthly),
                ),
                ButtonSegment(
                  value: DateIntervalType.yearly,
                  label: Text(LocalizationService.current.intervalTypeYearly),
                ),
                ButtonSegment(
                  value: DateIntervalType.oneTime,
                  label: Text(LocalizationService.current.intervalTypeOneTime),
                ),
              ],
              selected: {model.formState.intervalType},
              onSelectionChanged: (Set<DateIntervalType> selected) {
                if (selected.isNotEmpty) {
                  model.updateIntervalType(selected.first);
                }
              },
              multiSelectionEnabled: false,
            ),
          ],
        ),
    PlatformTextField(
      labelText: LocalizationService.current.fieldFrequency,
      initialValue: model.formState.frequency.toString(),
      keyboardType: TextInputType.number,
      onChanged: (value) => model.updateFrequency(int.tryParse(value) ?? 1),
      textAlign: TextAlign.right,
    ),
    PlatformTextField(
      labelText: LocalizationService.current.fieldRecurrence,
      initialValue: model.formState.recurrence.toString(),
      keyboardType: TextInputType.number,
      onChanged: (value) => model.updateRecurrence(int.tryParse(value) ?? 0),
      textAlign: TextAlign.right,
    ),
  ];
}
