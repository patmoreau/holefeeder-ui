import 'package:holefeeder/core/repositories.dart';
import 'package:holefeeder/core/services.dart';
import 'package:provider/provider.dart';

import 'user_settings_view_model.dart';

final viewModelProviders = [
  ChangeNotifierProvider<UserSettingsViewModel>(
    create:
        (context) => UserSettingsViewModel(
          repository: Provider.of<UserSettingsRepository>(
            context,
            listen: false,
          ),
          notificationService: Provider.of<NotificationService>(
            context,
            listen: false,
          ),
        ),
  ),
];
