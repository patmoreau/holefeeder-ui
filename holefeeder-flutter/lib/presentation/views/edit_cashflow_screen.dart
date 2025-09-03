import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/services.dart';
import 'package:holefeeder/presentation/widgets.dart';
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
      ChangeNotifierProvider<EditCashflowViewModel>(
        create:
            (context) => EditCashflowViewModel(
              cashflow: widget.cashflow,
              cashflowRepository: context.read<CashflowRepository>(),
              accountRepository: context.read<AccountRepository>(),
              categoryRepository: context.read<CategoryRepository>(),
              tagRepository: context.read<TagRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<EditCashflowViewModel>(
          builder:
              (context, model, child) => AdaptiveScaffold(
                leading: AdaptiveNavigationBackButton(
                  onPressed: () => _cancel(model),
                  previousPageTitle: L10nService.current.cashflows,
                ),
                title: L10nService.current.cashflow,
                actions: [
                  AdaptiveIconButton(
                    onPressed: () => _save(model),
                    icon: Icon(AdaptiveIcons.add_purchase),
                  ),
                ],
                child: _buildScreen(context, model),
              ),
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
