import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
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
      labelText: 'Note',
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
          prefix: const Text('Cashflow'),
          child: CupertinoSwitch(
            value: model.formState.isCashflow,
            onChanged: model.updateIsCashflow,
          ),
        )
        : SwitchListTile(
          title: const Text('Cashflow'),
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
          prefix: const Text('Interval Type'),
          child: CupertinoSlidingSegmentedControl<DateIntervalType>(
            groupValue: model.formState.intervalType,
            onValueChanged: model.updateIntervalType,
            children: const {
              DateIntervalType.daily: Text('Daily'),
              DateIntervalType.weekly: Text('Weekly'),
              DateIntervalType.monthly: Text('Monthly'),
              DateIntervalType.yearly: Text('Yearly'),
              DateIntervalType.oneTime: Text('One Time'),
            },
          ),
        )
        : Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Interval Type'),
            SegmentedButton<DateIntervalType>(
              segments: const [
                ButtonSegment(
                  value: DateIntervalType.daily,
                  label: Text('Daily'),
                ),
                ButtonSegment(
                  value: DateIntervalType.weekly,
                  label: Text('Weekly'),
                ),
                ButtonSegment(
                  value: DateIntervalType.monthly,
                  label: Text('Monthly'),
                ),
                ButtonSegment(
                  value: DateIntervalType.yearly,
                  label: Text('Yearly'),
                ),
                ButtonSegment(
                  value: DateIntervalType.oneTime,
                  label: Text('One Time'),
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
      labelText: 'Frequency',
      initialValue: model.formState.frequency.toString(),
      keyboardType: TextInputType.number,
      onChanged: (value) => model.updateFrequency(int.tryParse(value) ?? 1),
    ),
    PlatformTextField(
      labelText: 'Recurrence',
      initialValue: model.formState.recurrence.toString(),
      keyboardType: TextInputType.number,
      onChanged: (value) => model.updateRecurrence(int.tryParse(value) ?? 0),
    ),
  ];
}
