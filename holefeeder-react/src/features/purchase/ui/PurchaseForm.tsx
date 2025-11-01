import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { useInitPurchaseDefaults } from '@/features/purchase/core/use-init-purchase-defaults';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { usePurchaseFormHeader } from '@/features/purchase/core/use-purchase-form-header';
import { PurchaseFormContent } from '@/features/purchase/ui/PurchaseFormContent';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseForm = ({ accounts, categories, tags }: PurchaseFormProps) => {
  const { formData, setFormData, isDirty } = usePurchaseForm();

  useInitPurchaseDefaults(accounts, categories, formData, setFormData);

  usePurchaseFormHeader({
    isDirty,
    formData,
    onSave: async () => {
      console.log('Saving purchase:', formData);
    },
  });

  return <PurchaseFormContent accounts={accounts} categories={categories} tags={tags} />;
};
