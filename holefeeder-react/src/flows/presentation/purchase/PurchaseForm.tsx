import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Account } from '@/flows/core/accounts/account';
import { Category } from '@/flows/core/categories/category';
import { Tag } from '@/flows/core/flows/tag';
import { usePurchaseForm } from '@/flows/presentation/purchase/core/use-purchase-form';
import { PurchaseFormContent } from '@/flows/presentation/purchase/PurchaseFormContent';
import { AppButton } from '@/shared/presentation/components/AppButton';
import { useFormActions } from '@/shared/presentation/core/use-form-actions';
import { AppIcons } from '@/types/icons';

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
