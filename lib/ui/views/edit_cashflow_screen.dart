import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/extensions/extensions.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

import 'edit_cashflow_form.dart';

class EditCashflowScreen extends StatefulWidget {
  final Cashflow? cashflow;

  const EditCashflowScreen({super.key, this.cashflow});

  @override
  State<EditCashflowScreen> createState() => _EditCashflowScreenState();
}

class _EditCashflowScreenState extends State<EditCashflowScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) =>
      ViewModelProvider<EditCashflowViewModel>(
        create:
            (ctx) => EditCashflowViewModel(
              cashflow: widget.cashflow,
              cashflowRepository: ctx.read<CashflowRepository>(),
              accountRepository: ctx.read<AccountRepository>(),
              categoryRepository: ctx.read<CategoryRepository>(),
              tagRepository: ctx.read<TagRepository>(),
              notificationService: NotificationServiceProvider.of(ctx),
            ),
        builder:
            (model) => AdaptiveScaffold(
              leading: AdaptiveNavigationBackButton(
                onPressed: () => _cancel(model),
                previousPageTitle: LocalizationService.current.cashflows,
              ),
              title: LocalizationService.current.cashflow,
              actions: [
                AdaptiveIconButton(
                  onPressed: () => _save(model),
                  icon: Icon(AdaptiveIcons.add_purchase),
                ),
              ],
              child: _buildScreen(context, model),
            ),
      );

  Widget _buildScreen(BuildContext context, EditCashflowViewModel model) {
    return FormStateHandler(
      formState: model.formState,
      builder:
          () => Column(
            // Wrap Expanded with Column
            children: [
              Expanded(
                child: ScrollConfiguration(
                  behavior: ScrollConfiguration.of(
                    context,
                  ).copyWith(scrollbars: true),
                  child: SafeArea(
                    child: EditCashflowForm(model: model, formKey: _formKey),
                  ),
                ),
              ),
            ],
          ),
    );
  }

  void _cancel(EditCashflowViewModel model) => context.pop();

  Future<void> _save(EditCashflowViewModel model) async {
    // First validate the form fields using Flutter's form validation
    final isFormValid = _formKey.currentState!.validate();

    // Next, run the ViewModel's validation based on the selected segment
    final isModelValid = model.validateCashflow();

    // Only proceed if both validations pass
    if (!isFormValid || !isModelValid) {
      return;
    }

    _formKey.currentState!.save();
    await model.save();

    if (mounted) {
      context.popOrGoHome();
    }
  }
}
