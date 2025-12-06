import React from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/features/purchase/core/category';
import { AppField } from '@/features/shared/ui/AppField';
import { AppPicker } from '@/features/shared/ui/AppPicker';
import { tk } from '@/i18n/translations';
import { AppIcons } from '@/types/icons';

type Props = {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
};

export function CategoryField({ categories, selectedCategory, onSelectCategory }: Props) {
  const { t } = useTranslation();

  return (
    <AppField label={t(tk.purchase.basicSection.category)} icon={AppIcons.category}>
      <AppPicker
        options={categories}
        selectedOption={selectedCategory}
        onSelectOption={onSelectCategory}
        onOptionLabel={(category) => category.name}
      />
    </AppField>
  );
}
