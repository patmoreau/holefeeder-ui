import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/ui/screens/purchase_form.dart';
import 'package:universal_platform/universal_platform.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:provider/provider.dart';
import 'package:holefeeder/core/view_models/screens/purchase_view_model.dart';
import 'package:holefeeder/ui/services/notification_service.dart';
import 'package:holefeeder/ui/shared/view_model_provider.dart';

class PurchaseScreen extends StatefulWidget {
  const PurchaseScreen({super.key});

  @override
  State<PurchaseScreen> createState() => _PurchaseScreenState();
}

class _PurchaseScreenState extends State<PurchaseScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<PurchaseViewModel>(
      model: PurchaseViewModel(dataProvider: context.read<DataProvider>()),
      builder: (model) {
        return UniversalPlatform.isApple
            ? _buildCupertinoScaffold(model)
            : _buildMaterialScaffold(model);
      },
    );
  }

  Widget _buildCupertinoScaffold(PurchaseViewModel model) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        leading: CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: () {
            _cancel(model);
          },
          child: const Text('Cancel'),
        ),
        middle: const Text('Purchase'),
        trailing: CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: () {
            _save(model);
          },
          child: const Text('Save'),
        ),
      ),
      child: SafeArea(child: PurchaseForm(model: model, formKey: _formKey)),
    );
  }

  Widget _buildMaterialScaffold(PurchaseViewModel model) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Purchase'),
        actions: [
          TextButton(onPressed: () => _save(model), child: const Text('Save')),
        ],
      ),
      body: SafeArea(child: PurchaseForm(model: model, formKey: _formKey)),
    );
  }

  void _cancel(PurchaseViewModel model) {
    // Add confirmation dialog here if needed (check for unsaved changes)
    context.pop();
  }

  Future<void> _save(PurchaseViewModel model) async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    try {
      _formKey.currentState!.save(); // Save the form (if needed)

      await model.makePurchase();
      if (!mounted) return;

      await NotificationService.show(
        context: context,
        message: 'Purchase successful',
      );

      if (!mounted) return;
      if (context.canPop()) {
        context.pop();
      }
    } catch (error) {
      if (!mounted) return;
      await NotificationService.show(
        context: context,
        message: 'Error: $error',
        isError: true,
      );
    }
  }
}
