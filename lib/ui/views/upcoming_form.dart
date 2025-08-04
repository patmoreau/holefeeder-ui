import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/widgets/amount_field.dart';
import 'package:holefeeder/ui/widgets/date_picker_field.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';

class UpcomingForm extends StatelessWidget {
  final UpcomingViewModel model;
  final GlobalKey<FormState> formKey;

  const UpcomingForm({super.key, required this.model, required this.formKey});

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
  ];

  List<Widget> _buildBasicFields() => [
    AmountField(
      initialValue: model.amount,
      onChanged: model.updateAmount,
      autofocus: true,
    ),
    DatePickerField(selectedDate: model.date, onDateChanged: model.updateDate),
  ];
}
