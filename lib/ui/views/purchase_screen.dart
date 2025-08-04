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
      'Building with account: ${widget.account?.name}',
      name: 'PurchaseScreen',
    );
    return ChangeNotifierProvider<PurchaseViewModel>(
      create: (context) {
        developer.log('Creating PurchaseViewModel', name: 'PurchaseScreen');
        return PurchaseViewModel(
          account: widget.account,
          transactionRepository: context.read<TransactionRepository>(),
          accountRepository: context.read<AccountRepository>(),
          categoryRepository: context.read<CategoryRepository>(),
          tagRepository: context.read<TagRepository>(),
          notificationService: NotificationServiceProvider.of(context),
        );
      },
      child: Consumer<PurchaseViewModel>(
        builder: (context, model, child) {
          developer.log(
            'Builder called with model state: ${model.formState.state}',
            name: 'PurchaseScreen',
          );
          return AdaptiveScaffold(
            leading: AdaptiveNavigationBackButton(
              onPressed: () => _cancel(model),
              previousPageTitle:
                  (widget.account == null)
                      ? L10nService.current.dashboard
                      : L10nService.current.fieldAccount,
            ),
            title: L10nService.current.add,
            actions: [
              AdaptiveIconButton(
                onPressed: () => _save(model),
                icon: Icon(AdaptiveIcons.add_purchase),
              ),
            ],
            child: _buildScreen(context, model),
          );
        },
      ),
    );
  }

  Widget _buildScreen(BuildContext context, PurchaseViewModel model) {
    developer.log(
      '_buildScreen called with formState: ${model.formState.state}',
      name: 'PurchaseScreen',
    );
    return FormStateHandler(
      formState: model.formState,
      builder: () {
        developer.log(
          'FormStateHandler builder called, rendering content',
          name: 'PurchaseScreen',
        );
        developer.log('About to build Column widget', name: 'PurchaseScreen');
        return Column(
          children: [
            AdaptiveSegmentedControl<ListType>(
              groupValue: _selectedSegment,
              onValueChanged: (ListType? value) {
                developer.log(
                  'SegmentedControl value changed to: $value',
                  name: 'PurchaseScreen',
                );
                if (value != null) {
                  setState(() {
                    _selectedSegment = value;
                  });
                }
              },
              children: <ListType, Widget>{
                ListType.purchase: Text(L10nService.current.purchase),
                ListType.transfer: Text(L10nService.current.transfer),
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
                      'About to render form, selectedSegment: $_selectedSegment',
                      name: 'PurchaseScreen',
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
