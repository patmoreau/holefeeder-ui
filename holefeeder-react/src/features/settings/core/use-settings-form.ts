import { SettingsFormData } from '@/features/settings/core/settings-form-data';
import { createFormDataContext, ValidationFunction } from '@/features/shared/core/use-form-context';

export const SettingsFormError = {
  effectiveDateRequired: 'effectiveDateRequired',
  frequencyRequired: 'frequencyRequired',
} as const;

export type SettingsFormError = (typeof SettingsFormError)[keyof typeof SettingsFormError];

export const validateSettingsForm: ValidationFunction<SettingsFormData, SettingsFormError> = (formData) => {
  const errors: Partial<Record<keyof SettingsFormData, SettingsFormError>> = {};

  if (formData.effectiveDate === '') {
    errors.effectiveDate = SettingsFormError.effectiveDateRequired;
  }

  if (formData.frequency <= 0) {
    errors.frequency = SettingsFormError.frequencyRequired;
  }

  return errors;
};

export const { FormDataProvider: SettingsFormProvider, useFormDataContext: useSettingsForm } = createFormDataContext<
  SettingsFormData,
  SettingsFormError
>('Settings');
