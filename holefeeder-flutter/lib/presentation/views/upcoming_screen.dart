import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core.dart';
import 'package:holefeeder/l10n.dart';
import 'package:holefeeder/presentation/services.dart';
import 'package:holefeeder/presentation/widgets.dart';
import 'package:provider/provider.dart';

import 'upcoming_form.dart';

class UpcomingScreen extends StatefulWidget {
  final Upcoming upcoming;

  const UpcomingScreen({super.key, required this.upcoming});

  @override
  State<UpcomingScreen> createState() => _UpcomingScreenState();
}

class _UpcomingScreenState extends State<UpcomingScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<UpcomingViewModel>(
        create:
            (context) => UpcomingViewModel(
              upcoming: widget.upcoming,
              repository: context.read<UpcomingRepository>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<UpcomingViewModel>(
          builder:
              (context, model, child) => AdaptiveScaffold(
                leading: AdaptiveNavigationBackButton(
                  onPressed: () => _cancel(model),
                  previousPageTitle: L10nService.current.fieldAccount,
                ),
                title: L10nService.current.add,
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

  Widget _buildScreen(BuildContext context, UpcomingViewModel model) {
    return FormStateHandler(
      formState: model.formState,
      builder:
          () => SafeArea(child: UpcomingForm(model: model, formKey: _formKey)),
    );
  }

  void _cancel(UpcomingViewModel model) => context.pop();

  Future<void> _save(UpcomingViewModel model) async {
    final isFormValid = _formKey.currentState!.validate();

    final isModelValid = model.validate();

    // Only proceed if both validations pass
    if (!isFormValid || !isModelValid) {
      return;
    }

    _formKey.currentState!.save();
    await model.pay();

    if (mounted) {
      context.popOrGoHome();
    }
  }
}
