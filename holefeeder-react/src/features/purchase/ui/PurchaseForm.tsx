import { router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Purchase } from '@/features/purchase/core/purchase';
import { CancelPurchaseButton } from '@/features/purchase/ui/components/CancelPurchaseButton';
import { SavePurchaseButton } from '@/features/purchase/ui/components/SavePurchaseButton';
import { showAlert } from '@/features/shared/utils/show-alert';
import { withDate } from '@/features/shared/utils/with-date';
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
  const [formData, setFormData] = useState<Purchase>({
    date: withDate(new Date()).toDateOnly(),
    amount: 0,
    description: '',
    account: accounts[0],
    category: categories[0],
    tags: [],
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.account) {
      setFormData((prev) => ({ ...prev, account: accounts[0] }));
    }
  }, [accounts, formData.account]);

  useEffect(() => {
    if (categories && categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories, formData.category]);

  const updateField = <K extends keyof Purchase>(field: K, value: Purchase[K]) => {
    setFormData((prev) => {
      if (prev[field] !== value) {
        setIsDirty(true);
      }
      return { ...prev, [field]: value };
    });
  };

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

  return <></>;
};
