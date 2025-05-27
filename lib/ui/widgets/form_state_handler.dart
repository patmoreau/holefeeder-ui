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
  Widget build(BuildContext context) =>
      formState.state == ViewFormState.loading
          ? Center(child: loadingWidget ?? AdaptiveActivityIndicator())
          : builder();
}
