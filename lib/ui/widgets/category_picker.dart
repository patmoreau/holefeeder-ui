import 'dart:developer' as developer;

import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/adaptive/adaptive_picker.dart';

class CategoryPicker extends StatelessWidget {
  final List<Category> categories;
  final Category? selectedCategory;
  final ValueChanged<Category?> onChanged;
  final bool enabled;
  static int _buildCount = 0;

  const CategoryPicker({
    super.key,
    required this.categories,
    required this.selectedCategory,
    required this.onChanged,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    _buildCount++;
    developer.log(
      'Building (count: $_buildCount) with ${categories.length} categories',
      name: 'CategoryPicker',
    );
    // Don't render if we have no categories to pick from
    if (categories.isEmpty) {
      developer.log(
        'No categories, returning empty widget',
        name: 'CategoryPicker',
      );
      return const SizedBox.shrink();
    }

    developer.log('Rendering adaptive picker', name: 'CategoryPicker');
    return AdaptivePicker<Category>(
      label: LocalizationService.current.fieldCategory,
      value: selectedCategory,
      items: categories,
      displayStringFor: (category) => category.name,
      onChanged: onChanged,
      placeholder: LocalizationService.current.fieldCategoryPlaceHolder,
      enabled: enabled,
    );
  }
}
