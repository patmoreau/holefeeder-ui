import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/providers/notification_provider.dart';

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

    if (formState.state == ViewFormState.error && formState.errorMessage != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        NotificationServiceProvider.of(context).showNotification(formState.errorMessage!, isError: true);
      });
    }

    return builder();
  }
}
