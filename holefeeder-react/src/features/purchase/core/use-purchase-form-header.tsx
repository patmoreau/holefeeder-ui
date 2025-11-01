import { useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect } from 'react';
import { CancelPurchaseButton } from '@/features/purchase/ui/components/CancelPurchaseButton';
import { SavePurchaseButton } from '@/features/purchase/ui/components/SavePurchaseButton';
import { goBack } from '@/features/shared/utils/navigation';
import { showAlert } from '@/features/shared/utils/show-alert';
import { useLanguage } from '@/shared/hooks/use-language';

export function usePurchaseFormHeader(params: {
  isDirty: boolean;
  formData: unknown; // or your Purchase type
  onSave?: (data: any) => Promise<void> | void;
}) {
  const { isDirty, formData, onSave } = params;
  const { t } = useLanguage();
  const navigation = useNavigation();
  const { showDiscardAlert } = showAlert(t);

  const handleSave = useCallback(async () => {
    await onSave?.(formData);
  }, [formData, onSave]);

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
}
