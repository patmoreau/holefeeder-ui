import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/services/notification_service.dart';
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

  CategoriesViewModel({
    required DataProvider dataProvider,
    NotificationService? notificationService,
  }) : _dataProvider = dataProvider,
       super(const CategoriesFormState(), notificationService) {
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

  Future<void> createCategory(Category category) async {
    await handleAsync(() async {
      print('Creating category: $category');
      // await _dataProvider.createCategory(category);
      await loadCategories();
      await showNotification('Category created successfully');
    });
  }

  Future<void> updateCategory(Category category) async {
    await handleAsync(() async {
      print('Updating category: $category');
      // await _dataProvider.updateCategory(category);
      await loadCategories();
      await showNotification('Category updated successfully');
    });
  }

  Future<void> deleteCategory(Category category) async {
    await handleAsync(() async {
      print('Deleting category: $category');
      // await _dataProvider.deleteCategory(category.id);
      await loadCategories();
      await showNotification('Category deleted successfully');
    });
  }

  Future<void> refreshCategories() async {
    await loadCategories();
  }
}
