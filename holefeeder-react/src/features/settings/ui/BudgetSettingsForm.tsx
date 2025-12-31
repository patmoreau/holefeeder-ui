import { useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsForm } from '@/features/settings/core/use-settings-form';
import { BudgetSettingsFormContent } from '@/features/settings/ui/BudgetSettingsFormContent';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { goBack } from '@/features/shared/utils/navigation';
import { showAlert } from '@/features/shared/utils/show-alert';
import { AppIcons } from '@/types/icons';

export const BudgetSettingsForm = () => {
  const { formData, isDirty, hasErrors, getErrorCount, errors } = useSettingsForm();

  const { t } = useTranslation();
  const { showDiscardAlert, showFormErrorAlert } = showAlert(t);
  const navigation = useNavigation();

  const handleSave = useCallback(async () => {
    if (hasErrors()) {
      showFormErrorAlert({ errors: errors, errorCount: getErrorCount() });
      return;
    }
    if (isDirty) {
      console.log('Saving settings:', formData);
      // await purchaseMutation.mutateAsync(formData);
    }
    goBack();
  }, [errors, formData, getErrorCount, hasErrors, isDirty, showFormErrorAlert]);

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

  return <BudgetSettingsFormContent />;
};
