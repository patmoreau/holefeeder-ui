import '../services/notification_service.dart';
import 'base_form_state.dart';
import 'base_view_model.dart';

class ExampleFormState extends BaseFormState {
  ExampleFormState({super.state, super.errorMessage});

  @override
  ExampleFormState copyWith({ViewFormState? state, String? errorMessage}) {
    return ExampleFormState(
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class ExampleViewModel extends BaseViewModel<ExampleFormState> {
  ExampleViewModel(NotificationService notificationService)
    : super(ExampleFormState(), notificationService);

  Future<void> performAction() async {
    await handleAsync(() async {
      // Your business logic here
      await showNotification('Action completed successfully');
    });
  }

  Future<void> performRiskyAction() async {
    try {
      // Your business logic here that might throw
      throw Exception('Something went wrong');
    } catch (e) {
      // The error will be shown as a notification automatically
      // because we're using handleAsync
      await handleAsync(() => Future.error(e));
    }
  }
}
