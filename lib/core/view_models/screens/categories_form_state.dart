import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class CategoriesFormState extends BaseFormState {
  final List<Category> categories;

  const CategoriesFormState({
    this.categories = const [],
    super.state = ViewFormState.initial,
    super.errorMessage,
  });

  @override
  CategoriesFormState copyWith({
    List<Category>? categories,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return CategoriesFormState(
      categories: categories ?? this.categories,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
