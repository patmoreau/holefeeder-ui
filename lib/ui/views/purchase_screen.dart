import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/ui/services/notification_provider.dart';
import 'package:holefeeder/ui/views/purchase_form.dart';
import 'package:universal_platform/universal_platform.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:provider/provider.dart';
import 'package:holefeeder/core/view_models/screens/purchase_view_model.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';

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
      create: (ctx) => PurchaseViewModel(dataProvider: ctx.read<DataProvider>(), notificationService: NotificationServiceProvider.of(ctx)),
      builder: (model) {
        return UniversalPlatform.isApple ? _buildCupertinoScaffold(model) : _buildMaterialScaffold(model);
      },
    );
  }

  Widget _buildCupertinoScaffold(PurchaseViewModel model) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        leading: CupertinoButton(
          onPressed: () {
            _cancel(model);
          },
          child: const Text('Cancel'),
        ),
        middle: const Text('Purchase'),
        trailing: CupertinoButton(
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
      appBar: AppBar(title: const Text('Purchase'), actions: [TextButton(onPressed: () => _save(model), child: const Text('Save'))]),
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

    _formKey.currentState!.save(); // Save the form (if needed)
    await model.makePurchase();

    if (!mounted) return;
    if (context.canPop()) {
      context.pop();
    }
  }
}
