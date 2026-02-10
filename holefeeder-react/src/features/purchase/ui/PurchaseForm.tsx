import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { PurchaseFormContent } from '@/features/purchase/ui/PurchaseFormContent';
import { useFormActions } from '@/features/shared/core/use-form-actions';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { AppIcons } from '@/types/icons';
import { Account } from '@/use-cases/core/accounts/account';
import { Category } from '@/use-cases/core/categories/category';
import { Tag } from '@/use-cases/core/flows/tag';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseForm = ({ accounts, categories, tags }: PurchaseFormProps) => {
  const { saveForm, isDirty, errors } = usePurchaseForm();
  const { handleSave, handleCancel } = useFormActions({ saveForm, isDirty, errors });
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppButton icon={AppIcons.back} style={{ width: 35, height: 35 }} onPress={handleCancel} />,
    });
  }, [handleCancel, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <AppButton icon={AppIcons.save} style={{ width: 35, height: 35 }} onPress={handleSave} />,
    });
  }, [handleSave, navigation]);

  return <PurchaseFormContent accounts={accounts} categories={categories} tags={tags} />;
};
