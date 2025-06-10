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

import 'transaction_form.dart';

class EditTransactionScreen extends StatefulWidget {
  final Transaction? transaction;

  const EditTransactionScreen({super.key, this.transaction});

  @override
  State<EditTransactionScreen> createState() => _EditTransactionScreenState();
}

class _EditTransactionScreenState extends State<EditTransactionScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) =>
      ViewModelProvider<EditTransactionViewModel>(
        create:
            (ctx) => EditTransactionViewModel(
              transaction: widget.transaction,
              transactionRepository: ctx.read<TransactionRepository>(),
              accountRepository: ctx.read<AccountRepository>(),
              categoryRepository: ctx.read<CategoryRepository>(),
              tagRepository: ctx.read<TagRepository>(),
              notificationService: NotificationServiceProvider.of(ctx),
            ),
        builder:
            (model) => AdaptiveScaffold(
              leading: AdaptiveNavigationBackButton(
                onPressed: () => _cancel(model),
                previousPageTitle:
                    (widget.transaction == null)
                        ? LocalizationService.current.dashboard
                        : LocalizationService.current.fieldAccount,
              ),
              title: LocalizationService.current.add,
              actions: [
                AdaptiveIconButton(
                  onPressed: () => _save(model),
                  icon: Icon(AdaptiveIcons.add_purchase),
                ),
              ],
              child: _buildScreen(context, model),
            ),
      );

  Widget _buildScreen(BuildContext context, EditTransactionViewModel model) {
    return FormStateHandler(
      formState: model.formState,
      builder:
          () => Expanded(
            child: ScrollConfiguration(
              behavior: ScrollConfiguration.of(
                context,
              ).copyWith(scrollbars: true),
              child: SafeArea(
                child: EditTransactionForm(model: model, formKey: _formKey),
              ),
            ),
          ),
    );
  }

  void _cancel(EditTransactionViewModel model) => context.pop();

  Future<void> _save(EditTransactionViewModel model) async {
    // First validate the form fields using Flutter's form validation
    final isFormValid = _formKey.currentState!.validate();

    // Next, run the ViewModel's validation based on the selected segment
    final isModelValid = model.validatePurchase();

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
