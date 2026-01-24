import React from 'react';
import { useTranslation } from 'react-i18next';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { Tag } from '@/features/purchase/core/tag';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { AccountField } from '@/features/purchase/ui/components/fields/AccountField';
import { CategoryField } from '@/features/purchase/ui/components/fields/CategoryField';
import { DescriptionField } from '@/features/purchase/ui/components/fields/DescriptionField';
import { TagList } from '@/features/purchase/ui/components/TagList';
import { AppSection } from '@/features/shared/ui/AppSection';
import { DateField } from '@/features/shared/ui/fields/DateField';
import { tk } from '@/i18n/translations';
import { CategoryType } from '@/shared/core/category-type';

type Props = {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
};

export function BasicSection({ accounts, categories, tags }: Props) {
  const { t } = useTranslation();
  const { formData, updateFormField } = usePurchaseForm();

  const updateSourceAccount = (account: Account) => updateFormField('sourceAccount', account);

  const updateCategory = (category: Category) => updateFormField('category', category);

  const selectedTags = formData?.tags ?? [];
  const updateTags = (next: Tag[]) => updateFormField('tags', next);
  const updateDescription = (value: string) => updateFormField('description', value);

  const variant = formData.purchaseType === PurchaseType.expense ? CategoryType.expense : CategoryType.gain;

  return (
    <AppSection>
      <DateField
        label={t(tk.purchase.basicSection.date)}
        selectedDate={formData.date}
        onDateSelected={(date) => updateFormField('date', date)}
      />
      <AccountField
        label={t(tk.purchase.basicSection.account)}
        accounts={accounts}
        selectedAccount={formData.sourceAccount}
        onSelectAccount={updateSourceAccount}
      />
      <CategoryField categories={categories} selectedCategory={formData.category} onSelectCategory={updateCategory} variant={variant} />
      <TagList tags={tags} selected={selectedTags} onChange={updateTags} />
      <DescriptionField description={formData.description} onDescriptionChange={updateDescription} />
    </AppSection>
  );
}
