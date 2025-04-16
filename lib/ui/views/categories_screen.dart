import 'package:decimal/decimal.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/providers/notification_provider.dart';
import 'package:holefeeder/core/view_models/screens/categories_view_model.dart';
import 'package:holefeeder/ui/widgets/view_model_provider.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<CategoriesViewModel>(
      model: CategoriesViewModel(
        dataProvider: context.read<DataProvider>(),
        notificationService: NotificationServiceProvider.of(context),
      ),
      builder:
          (model) => Scaffold(
            appBar: AppBar(
              title: const Text('Categories'),
              actions: [
                IconButton(
                  icon: const Icon(Icons.add),
                  onPressed: () => _showAddCategoryDialog(context, model),
                ),
              ],
            ),
            body: _buildBody(model),
          ),
    );
  }

  Widget _buildBody(CategoriesViewModel model) {
    if (model.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (model.hasError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              model.error ?? 'An error occurred',
              style: const TextStyle(color: Colors.red),
            ),
            ElevatedButton(
              onPressed: model.refreshCategories,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: model.refreshCategories,
      child: ListView.builder(
        itemCount: model.categories.length,
        itemBuilder: (context, index) {
          final category = model.categories[index];
          return ListTile(
            title: Text(category.name),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed:
                      () => _showEditCategoryDialog(context, model, category),
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed:
                      () => _showDeleteConfirmation(context, model, category),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Future<void> _showAddCategoryDialog(
    BuildContext context,
    CategoriesViewModel model,
  ) async {
    final nameController = TextEditingController();
    final budgetController = TextEditingController(text: '0');

    return showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Add Category'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Category Name'),
                  autofocus: true,
                ),
                TextField(
                  controller: budgetController,
                  decoration: const InputDecoration(labelText: 'Budget Amount'),
                  keyboardType: TextInputType.number,
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  if (nameController.text.isNotEmpty) {
                    model.createCategory(
                      Category(
                        id: const Uuid().v4(),
                        name: nameController.text,
                        color: '#000000', // Default color
                        budgetAmount: Decimal.parse(budgetController.text),
                        favorite: false,
                      ),
                    );
                    context.pop();
                  }
                },
                child: const Text('Add'),
              ),
            ],
          ),
    );
  }

  Future<void> _showEditCategoryDialog(
    BuildContext context,
    CategoriesViewModel model,
    Category category,
  ) async {
    final nameController = TextEditingController(text: category.name);
    final budgetController = TextEditingController(
      text: category.budgetAmount.toString(),
    );

    return showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Edit Category'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Category Name'),
                  autofocus: true,
                ),
                TextField(
                  controller: budgetController,
                  decoration: const InputDecoration(labelText: 'Budget Amount'),
                  keyboardType: TextInputType.number,
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  if (nameController.text.isNotEmpty) {
                    model.updateCategory(
                      Category(
                        id: category.id,
                        name: nameController.text,
                        color: category.color,
                        budgetAmount: Decimal.parse(budgetController.text),
                        favorite: category.favorite,
                      ),
                    );
                    context.pop();
                  }
                },
                child: const Text('Save'),
              ),
            ],
          ),
    );
  }

  Future<void> _showDeleteConfirmation(
    BuildContext context,
    CategoriesViewModel model,
    Category category,
  ) async {
    return showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Delete Category'),
            content: Text('Are you sure you want to delete ${category.name}?'),
            actions: [
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  model.deleteCategory(category);
                  context.pop();
                },
                child: const Text('Delete'),
              ),
            ],
          ),
    );
  }
}
