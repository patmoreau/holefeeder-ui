import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/screens/purchase_view_model.dart';
import 'package:holefeeder/ui/shared/account_picker.dart';
import 'package:holefeeder/ui/shared/amount_field.dart';
import 'package:holefeeder/ui/shared/category_picker.dart';
import 'package:holefeeder/ui/shared/date_picker_field.dart';
import 'package:holefeeder/ui/shared/form_state_handler.dart';
import 'package:holefeeder/ui/shared/platform_tag_selector.dart';
import 'package:holefeeder/ui/shared/platform_text_field.dart';
import 'package:universal_platform/universal_platform.dart';

import 'package:holefeeder/core/enums/date_interval_type_enum.dart';

class PurchaseForm extends StatefulWidget {
  final PurchaseViewModel model;
  final GlobalKey<FormState> formKey;

  const PurchaseForm({super.key, required this.model, required this.formKey});

  @override
  State<PurchaseForm> createState() => _PurchaseFormState();
}

class _PurchaseFormState extends State<PurchaseForm> {
  @override
  Widget build(BuildContext context) {
    return FormStateHandler(
      formState: widget.model.formState,
      builder:
          () => Form(
            key: widget.formKey,
            child: ListView(
              children:
                  UniversalPlatform.isApple
                      ? _buildCupertinoForm()
                      : _buildMaterialForm(),
            ),
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
      if (widget.model.formState.isCashflow)
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
      if (widget.model.formState.isCashflow)
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
      initialValue: widget.model.formState.amount,
      onChanged: widget.model.updateAmount,
    ),
    DatePickerField(
      selectedDate: widget.model.formState.date,
      onDateChanged: widget.model.updateDate,
    ),
    AccountPicker(
      accounts: widget.model.accounts,
      selectedAccount: widget.model.formState.selectedAccount,
      onChanged: widget.model.setSelectedAccount,
    ),
    CategoryPicker(
      categories: widget.model.categories,
      selectedCategory: widget.model.formState.selectedCategory,
      onChanged: widget.model.setSelectedCategory,
    ),
    PlatformTextField(
      labelText: 'Note',
      initialValue: widget.model.formState.note,
      onChanged: widget.model.updateNote,
    ),
    PlatformTagSelector(
      allTags: widget.model.tags,
      selectedTags: widget.model.formState.tags,
      onTagsChanged: widget.model.updateTags,
    ),
    UniversalPlatform.isApple
        ? CupertinoFormRow(
          prefix: const Text('Cashflow'),
          child: CupertinoSwitch(
            value: widget.model.formState.isCashflow,
            onChanged: widget.model.updateIsCashflow,
          ),
        )
        : SwitchListTile(
          title: const Text('Cashflow'),
          value: widget.model.formState.isCashflow,
          onChanged: widget.model.updateIsCashflow,
        ),
  ];

  List<Widget> _buildCashflowFields() => [
    DatePickerField(
      selectedDate: widget.model.formState.effectiveDate,
      onDateChanged: widget.model.updateEffectiveDate,
    ),
    UniversalPlatform.isApple
        ? CupertinoFormRow(
          prefix: const Text('Interval Type'),
          child: CupertinoSlidingSegmentedControl<DateIntervalType>(
            groupValue: widget.model.formState.intervalType,
            onValueChanged: widget.model.updateIntervalType,
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
              selected: {widget.model.formState.intervalType},
              onSelectionChanged: (Set<DateIntervalType> selected) {
                if (selected.isNotEmpty) {
                  widget.model.updateIntervalType(selected.first);
                }
              },
              multiSelectionEnabled: false,
            ),
          ],
        ),
    PlatformTextField(
      labelText: 'Frequency',
      initialValue: widget.model.formState.frequency.toString(),
      keyboardType: TextInputType.number,
      onChanged:
          (value) => widget.model.updateFrequency(int.tryParse(value) ?? 1),
    ),
    PlatformTextField(
      labelText: 'Recurrence',
      initialValue: widget.model.formState.recurrence.toString(),
      keyboardType: TextInputType.number,
      onChanged:
          (value) => widget.model.updateRecurrence(int.tryParse(value) ?? 0),
    ),
  ];
}
