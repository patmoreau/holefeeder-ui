import { useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { usePurchase } from '@/features/purchase/core/use-transactions';
import { PurchaseFormContent } from '@/features/purchase/ui/PurchaseFormContent';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { goBack } from '@/features/shared/utils/navigation';
import { showAlert } from '@/features/shared/utils/show-alert';
import { AppIcons } from '@/types/icons';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseForm = ({ accounts, categories, tags }: PurchaseFormProps) => {
  const { formData, isDirty, hasErrors, getErrorCount, errors } = usePurchaseForm();
  const purchaseMutation = usePurchase();

  const { t } = useTranslation();
  const { showDiscardAlert, showFormErrorAlert } = showAlert(t);
  const navigation = useNavigation();

  const handleSave = useCallback(async () => {
    if (hasErrors()) {
      showFormErrorAlert({ errors: errors, errorCount: getErrorCount() });
      return;
    }
    if (isDirty) {
      await purchaseMutation.mutateAsync(formData);
    }
    goBack();
  }, [errors, formData, getErrorCount, hasErrors, isDirty, purchaseMutation, showFormErrorAlert]);

  const handleCancel = useCallback(() => {
    if (!isDirty) {
      goBack();
      return;
    }
    showDiscardAlert({ onConfirm: goBack });
  }, [isDirty, showDiscardAlert]);

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
