import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/features/purchase/core/category';
import { CategoryType } from '@/core/category-type';
import { AppField } from '@/features/shared/ui/AppField';
import { AppPicker } from '@/features/shared/ui/components/AppPicker';
import { tk } from '@/i18n/translations';
import { AppIcons } from '@/types/icons';

type Props = {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  variant?: CategoryType;
};

export function CategoryField({ categories, selectedCategory, onSelectCategory, variant }: Props) {
  const { t } = useTranslation();
  console.log('CategoryField:', categories);
  const filteredCategories = variant ? categories.filter((category) => category.type === variant) : categories;
  const isSelectedCategoryInFiltered = filteredCategories.some((category) => category.id === selectedCategory.id);

  useEffect(() => {
    if (!isSelectedCategoryInFiltered && filteredCategories.length > 0) {
      onSelectCategory(filteredCategories[0]);
    }
  }, [isSelectedCategoryInFiltered, filteredCategories, onSelectCategory]);

  return (
    <AppField label={t(tk.purchase.basicSection.category)} icon={AppIcons.category}>
      <AppPicker
        options={filteredCategories}
        selectedOption={isSelectedCategoryInFiltered ? selectedCategory : filteredCategories[0]}
        onSelectOption={onSelectCategory}
        onOptionLabel={(category) => category.name}
      />
    </AppField>
  );
}
