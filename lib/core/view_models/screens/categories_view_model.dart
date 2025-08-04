import '../../models/models.dart';
import '../../services/services.dart';
import '../base_form_state.dart';
import '../base_view_model.dart';
import 'categories_form_state.dart';

class CategoriesViewModel extends BaseViewModel<CategoriesFormState> {
  final ApiService _dataProvider;

  CategoriesViewModel({
    required ApiService dataProvider,
    required super.notificationService,
  }) : _dataProvider = dataProvider,
       super(formState: const CategoriesFormState()) {
    loadCategories();
  }

  List<Category> get categories => formState.categories;

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
      // await _dataProvider.createCategory(category);
      await loadCategories();
      await showNotification('Category created successfully');
    });
  }

  Future<void> updateCategory(Category category) async {
    await handleAsync(() async {
      // await _dataProvider.updateCategory(category);
      await loadCategories();
      await showNotification('Category updated successfully');
    });
  }

  Future<void> deleteCategory(Category category) async {
    await handleAsync(() async {
      // await _dataProvider.deleteCategory(category.id);
      await loadCategories();
      await showNotification('Category deleted successfully');
    });
  }

  Future<void> refreshCategories() async {
    await loadCategories();
  }
}
