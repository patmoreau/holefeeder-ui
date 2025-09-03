import 'package:holefeeder/core/models.dart';

import 'event_payload.dart';

class UserSettingsChangedEvent extends EventPayload {
  final UserSettings userSettings;

  @override
  final name = 'userSettingsChangedEvent';

  static UserSettingsChangedEvent get empty =>
      UserSettingsChangedEvent(UserSettings.empty);

  UserSettingsChangedEvent(this.userSettings);
}
