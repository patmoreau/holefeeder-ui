import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useSettingsForm } from '@/features/settings/core/use-settings-form';
import { BudgetSettingsFormContent } from '@/features/settings/ui/BudgetSettingsFormContent';
import { useFormActions } from '@/features/shared/core/use-form-actions';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { AppIcons } from '@/types/icons';

export const BudgetSettingsForm = () => {
  const { saveForm, isDirty, errors } = useSettingsForm();
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

  return <BudgetSettingsFormContent />;
};
