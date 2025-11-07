import { useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect } from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { usePurchase } from '@/features/purchase/core/use-transactions';
import { CancelPurchaseButton } from '@/features/purchase/ui/components/CancelPurchaseButton';
import { SavePurchaseButton } from '@/features/purchase/ui/components/SavePurchaseButton';
import { PurchaseFormContent } from '@/features/purchase/ui/PurchaseFormContent';
import { goBack } from '@/features/shared/utils/navigation';
import { showAlert } from '@/features/shared/utils/show-alert';
import { useLanguage } from '@/shared/hooks/use-language';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseForm = ({ accounts, categories, tags }: PurchaseFormProps) => {
  const { formData, isDirty } = usePurchaseForm();
  const purchaseMutation = usePurchase();

  const { t } = useLanguage();
  const { showDiscardAlert } = showAlert(t);
  const navigation = useNavigation();

  const handleSave = useCallback(async () => {
    if (isDirty) {
      await purchaseMutation.mutateAsync(formData);
    }
    goBack();
  }, [formData, isDirty, purchaseMutation]);

  const handleCancel = useCallback(() => {
    if (!isDirty) {
      goBack();
      return;
    }
    showDiscardAlert({ onConfirm: goBack });
  }, [isDirty, showDiscardAlert]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelPurchaseButton onCancel={handleCancel} />,
    });
  }, [handleCancel, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SavePurchaseButton onSave={handleSave} />,
    });
  }, [handleSave, navigation]);

  return <PurchaseFormContent accounts={accounts} categories={categories} tags={tags} />;
};
