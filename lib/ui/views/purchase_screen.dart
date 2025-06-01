import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/extensions/extensions.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/views/purchase_form.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

class PurchaseScreen extends StatefulWidget {
  final Account? account;

  const PurchaseScreen({super.key, this.account});

  @override
  State<PurchaseScreen> createState() => _PurchaseScreenState();
}

class _PurchaseScreenState extends State<PurchaseScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) => ViewModelProvider<PurchaseViewModel>(
    create:
        (ctx) => PurchaseViewModel(
          account: widget.account,
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
                (widget.account == null)
                    ? LocalizationService.current.dashboard
                    : LocalizationService.current.fieldAccount,
          ),
          title: LocalizationService.current.purchaseTitle,
          actions: [
            AdaptiveIconButton(
              onPressed: () => _save(model),
              icon: Icon(AdaptiveIcons.add_purchase),
            ),
          ],
          child: _buildScreen(context, model),
        ),
  );

  Widget _buildScreen(BuildContext context, PurchaseViewModel model) {
    return FormStateHandler(
      formState: model.formState,
      builder:
          () => ScrollConfiguration(
            behavior: ScrollConfiguration.of(
              context,
            ).copyWith(scrollbars: true),
            child: SafeArea(
              child: PurchaseForm(model: model, formKey: _formKey),
            ),
          ),
    );
  }

  void _cancel(PurchaseViewModel model) => context.pop();

  Future<void> _save(PurchaseViewModel model) async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    _formKey.currentState!.save();
    await model.makePurchase();

    if (mounted) {
      context.popOrGoHome();
    }
  }
}
