import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsForm } from '@/features/settings/core/use-settings-form';
import { AppForm } from '@/features/shared/ui/AppForm';
import { AppSection } from '@/features/shared/ui/AppSection';
import { DateField } from '@/features/shared/ui/fields/DateField';
import { DateIntervalTypeField } from '@/features/shared/ui/fields/DateIntervalTypeField';
import { FrequencyField } from '@/features/shared/ui/fields/FrequencyField';
import { tk } from '@/i18n/translations';

export const BudgetSettingsFormContent = () => {
  const { t } = useTranslation();
  const { formData, updateFormField } = useSettingsForm();

  return (
    <AppForm>
      <AppSection title={t(tk.budgetSettings.section)}>
        <DateField
          label={t(tk.budgetSettings.date)}
          selectedDate={formData.effectiveDate}
          onDateSelected={(date) => updateFormField('effectiveDate', date)}
        />
        <DateIntervalTypeField
          selectedDateIntervalType={formData.intervalType}
          onSelectDateIntervalType={(type) => updateFormField('intervalType', type)}
        />
        <FrequencyField selectedFrequency={formData.frequency} onSelectFrequency={(frequency) => updateFormField('frequency', frequency)} />
      </AppSection>
    </AppForm>
  );
};
