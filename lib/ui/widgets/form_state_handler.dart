import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/ui/services/notification_provider.dart';

class FormStateHandler extends StatelessWidget {
  final BaseFormState formState;
  final Widget Function() builder;
  final Widget? loadingWidget;

  const FormStateHandler({
    super.key,
    required this.formState,
    required this.builder,
    this.loadingWidget,
  });

  @override
  Widget build(BuildContext context) {
    if (formState.state == ViewFormState.loading) {
      return Center(child: loadingWidget ?? const CircularProgressIndicator());
    }

    return builder();
  }
}
