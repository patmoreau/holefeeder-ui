import 'dart:developer' as developer;

import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/extensions/extensions.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/views/purchase_form.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

import 'purchase_transfer_form.dart';

enum ListType { purchase, transfer }

class PurchaseScreen extends StatefulWidget {
  final Account? account;

  const PurchaseScreen({super.key, this.account});

  @override
  State<PurchaseScreen> createState() => _PurchaseScreenState();
}

class _PurchaseScreenState extends State<PurchaseScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  ListType _selectedSegment = ListType.purchase;

  @override
  Widget build(BuildContext context) {
    developer.log(
      '[PurchaseScreen] Building with account: ${widget.account?.name}',
    );
    return ViewModelProvider<PurchaseViewModel>(
      create: (ctx) {
        developer.log('[PurchaseScreen] Creating PurchaseViewModel');
        return PurchaseViewModel(
          account: widget.account,
          transactionRepository: ctx.read<TransactionRepository>(),
          accountRepository: ctx.read<AccountRepository>(),
          categoryRepository: ctx.read<CategoryRepository>(),
          tagRepository: ctx.read<TagRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        );
      },
      builder: (model) {
        developer.log(
          '[PurchaseScreen] Builder called with model state: ${model.formState.state}',
        );
        return AdaptiveScaffold(
          leading: AdaptiveNavigationBackButton(
            onPressed: () => _cancel(model),
            previousPageTitle:
                (widget.account == null)
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
        );
      },
    );
  }

  Widget _buildScreen(BuildContext context, PurchaseViewModel model) {
    developer.log(
      '[PurchaseScreen] _buildScreen called with formState: ${model.formState.state}',
    );
    return FormStateHandler(
      formState: model.formState,
      builder: () {
        developer.log(
          '[PurchaseScreen] FormStateHandler builder called, rendering content',
        );
        developer.log('[PurchaseScreen] About to build Column widget');
        return Column(
          children: [
            AdaptiveSegmentedControl<ListType>(
              groupValue: _selectedSegment,
              onValueChanged: (ListType? value) {
                developer.log(
                  '[PurchaseScreen] SegmentedControl value changed to: $value',
                );
                if (value != null) {
                  setState(() {
                    _selectedSegment = value;
                  });
                }
              },
              children: <ListType, Widget>{
                ListType.purchase: Text(LocalizationService.current.purchase),
                ListType.transfer: Text(LocalizationService.current.transfer),
              },
            ),
            Expanded(
              child: ScrollConfiguration(
                behavior: ScrollConfiguration.of(
                  context,
                ).copyWith(scrollbars: true),
                child: SafeArea(
                  child: () {
                    developer.log(
                      '[PurchaseScreen] About to render form, selectedSegment: $_selectedSegment',
                    );
                    return _selectedSegment == ListType.purchase
                        ? PurchaseForm(model: model, formKey: _formKey)
                        : PurchaseTransferForm(model: model, formKey: _formKey);
                  }(),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  void _cancel(PurchaseViewModel model) => context.pop();

  Future<void> _save(PurchaseViewModel model) async {
    // First validate the form fields using Flutter's form validation
    final isFormValid = _formKey.currentState!.validate();

    // Next, run the ViewModel's validation based on the selected segment
    final isModelValid =
        _selectedSegment == ListType.purchase
            ? model.validatePurchase()
            : model.validateTransfer();

    // Only proceed if both validations pass
    if (!isFormValid || !isModelValid) {
      return;
    }

    _formKey.currentState!.save();
    if (_selectedSegment == ListType.purchase) {
      await model.makePurchase();
    } else {
      await model.makeTransfer();
    }

    if (mounted) {
      context.popOrGoHome();
    }
  }
}
