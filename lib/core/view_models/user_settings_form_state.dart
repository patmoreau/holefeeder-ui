import 'package:holefeeder/core/models/models.dart';

import 'base_form_state.dart';

class UserSettingsFormState extends BaseFormState {
  final UserSettings? settings;
  final String? storeItemId;
  final DateInterval currentPeriod;

  UserSettingsFormState({
    super.state = ViewFormState.initial,
    super.errorMessage,
    this.settings,
    this.storeItemId,
    DateInterval? currentPeriod,
  }) : currentPeriod =
           currentPeriod ??
           DateInterval(DateTime.now(), DateTime.now().add(Duration(days: 14)));

  @override
  UserSettingsFormState copyWith({
    ViewFormState? state,
    String? errorMessage,
    UserSettings? settings,
    String? storeItemId,
    DateInterval? currentPeriod,
  }) {
    return UserSettingsFormState(
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
      settings: settings ?? this.settings,
      storeItemId: storeItemId ?? this.storeItemId,
      currentPeriod: currentPeriod ?? this.currentPeriod,
    );
  }
}
