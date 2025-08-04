import 'package:decimal/decimal.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/services/services.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:provider/provider.dart';

import '../../core/services/services.dart';

class CashflowsScreen extends StatelessWidget {
  const CashflowsScreen({super.key});

  @override
  Widget build(BuildContext context) =>
      ChangeNotifierProvider<CategoriesViewModel>(
        create:
            (context) => CategoriesViewModel(
              dataProvider: context.read<ApiService>(),
              notificationService: NotificationServiceProvider.of(context),
            ),
        child: Consumer<CategoriesViewModel>(
          builder:
              (context, model, child) => FormStateHandler(
                formState: model.formState,
                builder: () {
                  if (model.isLoading) {
                    return const Center(child: AdaptiveActivityIndicator());
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

                  return RefreshIndicator.adaptive(
                    onRefresh: model.refreshCategories,
                    child: ListView.builder(
                      itemCount: model.categories.length,
                      itemBuilder: (context, index) {
                        final category = model.categories[index];
                        return AdaptiveListTile(
                          title: Text(category.name),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.edit),
                                onPressed:
                                    () => _showEditCategoryDialog(
                                      context,
                                      model,
                                      category,
                                    ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete),
                                onPressed:
                                    () => _showDeleteConfirmation(
                                      context,
                                      model,
                                      category,
                                    ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
        ),
      );

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
