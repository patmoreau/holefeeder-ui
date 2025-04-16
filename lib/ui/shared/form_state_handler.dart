import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/ui/dialogs/error_dialog.dart';

class FormStateHandler extends StatelessWidget {
  final BaseFormState formState;
  final Widget Function() builder;
  final Widget? loadingWidget;
  final Duration errorAutoDismiss;

  const FormStateHandler({
    super.key,
    required this.formState,
    required this.builder,
    this.loadingWidget,
    this.errorAutoDismiss = const Duration(seconds: 3),
  });

  @override
  Widget build(BuildContext context) {
    if (formState.state == ViewFormState.loading) {
      return Center(child: loadingWidget ?? const CircularProgressIndicator());
    }

    if (formState.state == ViewFormState.error) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder:
              (context) => ErrorDialog(
                message: formState.errorMessage ?? '',
                autoDismiss: errorAutoDismiss,
              ),
        );
      });
    }

    return builder();
  }
}
