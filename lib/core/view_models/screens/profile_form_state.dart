import 'package:holefeeder/core/view_models/base_form_state.dart';

class ProfileFormState extends BaseFormState {
  final String name;
  final String pictureUrl;
  final DateTime? tokenExpiresAt;
  final String tokenType;

  ProfileFormState({
    this.name = '',
    this.pictureUrl = '',
    this.tokenExpiresAt,
    this.tokenType = '',
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  ProfileFormState copyWith({
    String? name,
    String? pictureUrl,
    DateTime? tokenExpiresAt,
    String? tokenType,
    ViewFormState? state,
    String? errorMessage,
  }) => ProfileFormState(
    name: name ?? this.name,
    pictureUrl: pictureUrl ?? this.pictureUrl,
    tokenExpiresAt: tokenExpiresAt ?? this.tokenExpiresAt,
    tokenType: tokenType ?? this.tokenType,
    state: state ?? this.state,
    errorMessage: errorMessage ?? this.errorMessage,
  );

  bool get isEmpty => name.isEmpty && pictureUrl.isEmpty;
}
