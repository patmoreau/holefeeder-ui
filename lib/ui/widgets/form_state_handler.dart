import 'dart:developer' as developer;

import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

import 'adaptive/adaptive.dart';

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
    developer.log('[FormStateHandler] Building with state: ${formState.state}');
    switch (formState.state) {
      case ViewFormState.loading:
        developer.log('[FormStateHandler] Returning loading widget');
        return Center(child: loadingWidget ?? AdaptiveActivityIndicator());
      case ViewFormState.error:
        developer.log(
          '[FormStateHandler] Returning error widget: ${formState.errorMessage}',
        );
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 48,
                color: Theme.of(context).colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                formState.errorMessage ?? 'An error occurred',
                style: TextStyle(color: Theme.of(context).colorScheme.error),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      case ViewFormState.initial:
      case ViewFormState.ready:
        developer.log('[FormStateHandler] Returning content from builder');
        return builder();
    }
  }
}
