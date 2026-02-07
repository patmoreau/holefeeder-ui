import { useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { PurchaseFormContent } from '@/features/purchase/ui/PurchaseFormContent';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { goBack } from '@/features/shared/utils/navigation';
import { showAlert } from '@/features/shared/utils/show-alert';
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
  const { saveForm, isDirty, hasErrors, getErrorCount, errors, generalError } = usePurchaseForm();

  const { t } = useTranslation();
  const { showDiscardAlert, showFormErrorAlert } = showAlert(t);
  const navigation = useNavigation();

  const handleSave = useCallback(async () => {
    if (hasErrors()) {
      showFormErrorAlert({ errors: errors, errorCount: getErrorCount() });
      return;
    }
    if (isDirty) {
      await saveForm();
    }
    if (generalError === null) {
      goBack();
    }
  }, [errors, getErrorCount, hasErrors, isDirty, saveForm, showFormErrorAlert, generalError]);

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
