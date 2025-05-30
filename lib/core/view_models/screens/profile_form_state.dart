import '../base_form_state.dart';

class ProfileFormState extends BaseFormState {
  final String name;
  final String pictureUrl;

  ProfileFormState({
    this.name = '',
    this.pictureUrl = '',
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  ProfileFormState copyWith({
    String? name,
    String? pictureUrl,
    ViewFormState? state,
    String? errorMessage,
  }) => ProfileFormState(
    name: name ?? this.name,
    pictureUrl: pictureUrl ?? this.pictureUrl,
    state: state ?? this.state,
    errorMessage: errorMessage ?? this.errorMessage,
  );

  bool get isEmpty => name.isEmpty && pictureUrl.isEmpty;
}
