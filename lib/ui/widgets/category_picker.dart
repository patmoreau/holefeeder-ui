import 'package:flutter/widgets.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/ui/widgets/platform_picker_widget.dart';

class CategoryPicker extends StatelessWidget {
  final List<Category> categories;
  final Category? selectedCategory;
  final ValueChanged<Category?> onChanged;

  const CategoryPicker({
    super.key,
    required this.categories,
    required this.selectedCategory,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return PlatformPicker<Category>(
      label: LocalizationService.current.fieldCategory,
      value: selectedCategory,
      items: categories,
      displayStringFor: (category) => category.name,
      onChanged: onChanged,
      placeholder: LocalizationService.current.fieldCategoryPlaceHolder,
    );
  }
}
