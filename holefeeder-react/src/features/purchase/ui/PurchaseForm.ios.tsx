import { Form, Host } from '@expo/ui/swift-ui';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { AdditionalDetailsSection } from '@/features/purchase/ui/AdditionalDetailsSection';
import { BasicSection } from '@/features/purchase/ui/BasicSection';
import { CancelPurchaseButton } from '@/features/purchase/ui/components/CancelPurchaseButton.ios';
import { SavePurchaseButton } from '@/features/purchase/ui/components/SavePurchaseButton';
import { showAlert } from '@/features/shared/utils/show-alert';
import { useLanguage } from '@/shared/hooks/use-language';

const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
};

export const PurchaseForm = ({ accounts, categories }: { accounts: Account[]; categories: Category[] }) => {
  const { t } = useLanguage();
  const navigation = useNavigation();

  const { showDiscardAlert } = showAlert(t);
  const { isDirty, formData, setFormData, updateFormField } = usePurchaseForm();

  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.account) {
      setFormData((prev) => ({ ...prev, account: accounts[0] }));
    }
  }, [accounts, formData.account, setFormData]);

  useEffect(() => {
    if (categories && categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories, formData.category, setFormData]);

  const handleSave = useCallback(async () => {
    console.log('Saving purchase:', formData);
  }, [formData]);

  const handleCancel = useCallback(() => {
    if (!isDirty) {
      goBack();
      return;
    }

    showDiscardAlert({
      onConfirm: goBack,
    });
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

  return (
    <>
      <Host style={{ flex: 1 }}>
        <Form scrollEnabled={false}>
          <BasicSection accounts={accounts} categories={categories} />
          <AdditionalDetailsSection />
        </Form>
      </Host>
    </>
  );
};
