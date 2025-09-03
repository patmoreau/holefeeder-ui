import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class UpcomingFormState extends BaseFormState {
  final Upcoming upcoming;
  final bool isRefreshing;

  const UpcomingFormState({
    required this.upcoming,
    this.isRefreshing = false,
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  UpcomingFormState copyWith({
    Upcoming? upcoming,
    bool? isRefreshing,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return UpcomingFormState(
      upcoming: upcoming ?? this.upcoming,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
