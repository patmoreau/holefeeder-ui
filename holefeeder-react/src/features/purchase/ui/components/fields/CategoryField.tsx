import React from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/features/purchase/core/category';
import { Field } from '@/features/shared/ui/Field';
import { Picker } from '@/features/shared/ui/Picker';
import { tk } from '@/i18n/translations';

type Props = {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
};

export function CategoryField({ categories, selectedCategory, onSelectCategory }: Props) {
  const { t } = useTranslation();

  return (
    <Field label={t(tk.purchase.basicSection.category)} icon={'cart'}>
      <Picker
        options={categories}
        selectedOption={selectedCategory}
        onSelectOption={onSelectCategory}
        onOptionLabel={(category) => category.name}
      />
    </Field>
  );
}
