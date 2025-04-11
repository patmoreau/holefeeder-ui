import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

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

class CategoriesViewModel extends BaseViewModel<CategoriesFormState> {
  final DataProvider _dataProvider;

  List<Category> get categories => formState.categories;

  CategoriesViewModel({required DataProvider dataProvider})
    : _dataProvider = dataProvider,
      super(const CategoriesFormState()) {
    loadCategories();
  }

  Future<void> loadCategories() async {
    await handleAsync(() async {
      final categories = await _dataProvider.getCategories();
      updateState(
        (state) =>
            state.copyWith(categories: categories, state: ViewFormState.ready),
      );
    });
  }

  Future<void> refreshCategories() async {
    await loadCategories();
  }
}
