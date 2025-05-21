import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/widgets/form_state_handler.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:universal_platform/universal_platform.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key, required this.account});
  final AccountViewModel account;

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late final AccountViewModel _accountViewModel;

  @override
  void initState() {
    super.initState();
    _accountViewModel = widget.account;
  }

  @override
  Widget build(BuildContext context) => ViewModelProvider<AccountViewModel>(
    value: () => _accountViewModel,
    builder: (model) {
      return UniversalPlatform.isApple
          ? _buildCupertinoScaffold(model)
          : _buildMaterialScaffold(model);
    },
  );

  Widget _buildCupertinoScaffold(AccountViewModel model) {
    const edgeInsets = EdgeInsets.symmetric(horizontal: 16);
    return CupertinoPageScaffold(
      child: CustomScrollView(
        slivers: <Widget>[
          CupertinoSliverNavigationBar(
            padding: EdgeInsetsDirectional.zero,
            leading: CupertinoNavigationBarBackButton(
              previousPageTitle: LocalizationService.current.back,
              onPressed: () => _cancel(model),
            ),
            trailing: CupertinoButton(
              padding: edgeInsets,
              onPressed: () => context.pop(),
              child: Text(LocalizationService.current.save),
            ),
            largeTitle: Text(model.account.name),
          ),
          SliverSafeArea(
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                FormStateHandler(
                  formState: model.formState,
                  builder: () => Container(),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMaterialScaffold(AccountViewModel model) => Scaffold(
    appBar: AppBar(
      title: Text(LocalizationService.current.purchase),
      actions: [
        TextButton(
          onPressed: () => context.pop(),
          child: Text(LocalizationService.current.save),
        ),
      ],
    ),
    body: SafeArea(
      child: FormStateHandler(
        formState: model.formState,
        builder: () => Container(),
      ),
    ),
  );

  void _cancel(AccountViewModel model) => context.pop();
}
