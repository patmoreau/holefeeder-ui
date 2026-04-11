import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { BudgetSettingsFormContent } from '@/settings/ui/BudgetSettingsFormContent';
import { useSettingsForm } from '@/settings/ui/core/use-settings-form';
import { AppButton } from '@/shared/presentation/components/AppButton';
import { useFormActions } from '@/shared/presentation/core/use-form-actions';
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
