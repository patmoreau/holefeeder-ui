import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/constants/strings.dart';
import 'package:holefeeder/core/extensions/build_context_extensions.dart';
import 'package:holefeeder/core/services/services.dart';
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
  Widget build(BuildContext context) => ViewModelProvider<PurchaseViewModel>(
    create:
        (ctx) => PurchaseViewModel(
          dataProvider: ctx.read<DataProvider>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder: (model) {
      return UniversalPlatform.isApple
          ? _buildCupertinoScaffold(model)
          : _buildMaterialScaffold(model);
    },
  );

  Widget _buildCupertinoScaffold(PurchaseViewModel model) {
    const edgeInsets = EdgeInsets.symmetric(horizontal: 16);
    return CupertinoPageScaffold(
      child: CustomScrollView(
        slivers: <Widget>[
          CupertinoSliverNavigationBar(
            padding: EdgeInsetsDirectional.zero,
            leading: CupertinoButton(
              padding: edgeInsets,
              onPressed: () => _cancel(model),
              child: Text('$kBackTextIcon ${LocalizationService.current.back}'),
            ),
            trailing: CupertinoButton(
              padding: edgeInsets,
              onPressed: () => _save(model),
              child: Text(LocalizationService.current.save),
            ),
            largeTitle: Text(LocalizationService.current.purchase),
          ),
          SliverSafeArea(
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                PurchaseForm(model: model, formKey: _formKey),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMaterialScaffold(PurchaseViewModel model) => Scaffold(
    appBar: AppBar(
      title: Text(LocalizationService.current.purchase),
      actions: [
        TextButton(
          onPressed: () => _save(model),
          child: Text(LocalizationService.current.save),
        ),
      ],
    ),
    body: SafeArea(child: PurchaseForm(model: model, formKey: _formKey)),
  );

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
