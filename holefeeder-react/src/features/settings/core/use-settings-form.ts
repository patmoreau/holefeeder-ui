import { Repositories } from '@/contexts/RepositoryContext';
import { Result } from '@/domain/core/result';
import { SaveSettingsCommand } from '@/domain/core/store-items/save-settings/save-settings-command';
import { SaveSettingsUseCase } from '@/domain/core/store-items/save-settings/save-settings-use-case';
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

const save = async (repositories: Repositories, formData: SettingsFormData): Promise<Result<unknown>> => {
  const useCase = SaveSettingsUseCase(repositories.storeItemRepository);
  const command = SaveSettingsCommand.create(formData);
  if (command.isFailure || command.isLoading) return command;
  return useCase.execute(command.value);
};

export const { FormDataProvider: SettingsFormProvider, useFormDataContext: useSettingsForm } = createFormDataContext<
  SettingsFormData,
  SettingsFormError
>('Settings', save);
