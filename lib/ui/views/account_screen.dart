import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/views/account_form.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key, required this.account});

  final Account account;

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) => ViewModelProvider<AccountViewModel>(
    create:
        (ctx) => AccountViewModel(
          accountId: widget.account.id,
          accountRepository: ctx.read<AccountRepository>(),
          upcomingRepository: ctx.read<UpcomingRepository>(),
          transactionRepository: ctx.read<TransactionRepository>(),
          notificationService: NotificationServiceProvider.of(ctx),
        ),
    builder:
        (model) => AdaptiveScaffold(
          leading: AdaptiveNavigationBackButton(
            onPressed: () => context.pop(),
            previousPageTitle: LocalizationService.current.dashboard,
          ),
          actions: [],
          bottomBar: Stack(
            alignment: Alignment.center,
            children: [
              Center(
                child: Text(
                  '${LocalizationService.current.lastUpdated}: ${DateFormat.yMd(LocalizationService.device.toLanguageTag()).format(model.account.updated)}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: CupertinoColors.systemGrey,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: AdaptiveIconButton(
                  padding: EdgeInsets.only(right: 16.0),
                  onPressed:
                      () => context.push('/purchase', extra: model.account),
                  icon: Icon(AdaptiveIcons.purchase, size: 28.0),
                ),
              ),
            ],
          ),
          child: _buildScreen(context, model),
        ),
  );

  Widget _buildScreen(BuildContext context, AccountViewModel model) {
    return FormStateHandler(
      formState: model.formState,
      builder:
          () => SafeArea(child: AccountForm(model: model, formKey: _formKey)),
    );
  }
}
