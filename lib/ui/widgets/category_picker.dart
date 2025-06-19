import 'dart:developer' as developer;

import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_picker.dart';

class CategoryPicker extends StatelessWidget {
  final List<Category> categories;
  final Category? selectedCategory;
  final ValueChanged<Category?> onChanged;
  static int _buildCount = 0;

  const CategoryPicker({
    super.key,
    required this.categories,
    required this.selectedCategory,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    _buildCount++;
    developer.log(
      '[CategoryPicker] Building (count: $_buildCount) with ${categories.length} categories',
    );
    // Don't render if we have no categories to pick from
    if (categories.isEmpty) {
      developer.log('[CategoryPicker] No categories, returning empty widget');
      return const SizedBox.shrink();
    }

    developer.log('[CategoryPicker] Rendering adaptive picker');
    return AdaptivePicker<Category>(
      label: LocalizationService.current.fieldCategory,
      value: selectedCategory,
      items: categories,
      displayStringFor: (category) => category.name,
      onChanged: onChanged,
      placeholder: LocalizationService.current.fieldCategoryPlaceHolder,
    );
  }
}
