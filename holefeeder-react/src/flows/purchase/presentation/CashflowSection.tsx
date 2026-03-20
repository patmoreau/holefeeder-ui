import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppSection } from '@/features/shared/ui/AppSection';
import { DateField } from '@/features/shared/ui/fields/DateField';
import { DateIntervalTypeField } from '@/features/shared/ui/fields/DateIntervalTypeField';
import { FrequencyField } from '@/features/shared/ui/fields/FrequencyField';
import { HasCashflowField } from '@/flows/purchase/presentation/components/fields/HasCashflowField';
import { usePurchaseForm } from '@/flows/purchase/presentation/core/use-purchase-form';
import { tk } from '@/i18n/translations';

export const CashflowSection = () => {
  const { t } = useTranslation();
  const { formData, updateFormField } = usePurchaseForm();

  if (!formData.hasCashflow) {
    return (
      <AppSection title={t(tk.purchase.cashflowSection.title)}>
        <HasCashflowField hasCashflow={formData.hasCashflow} onHasCashflowChange={(value) => updateFormField('hasCashflow', value)} />
      </AppSection>
    );
  }

  return (
    <AppSection title={t(tk.purchase.cashflowSection.title)}>
      <HasCashflowField hasCashflow={formData.hasCashflow} onHasCashflowChange={(value) => updateFormField('hasCashflow', value)} />
      <DateField
        label={t(tk.purchase.cashflowSection.date)}
        selectedDate={formData.cashflowEffectiveDate}
        onDateSelected={(date) => updateFormField('cashflowEffectiveDate', date)}
      />
      <DateIntervalTypeField
        selectedDateIntervalType={formData.cashflowIntervalType}
        onSelectDateIntervalType={(type) => updateFormField('cashflowIntervalType', type)}
      />
      <FrequencyField
        selectedFrequency={formData.cashflowFrequency}
        onSelectFrequency={(frequency) => updateFormField('cashflowFrequency', frequency)}
      />
    </AppSection>
  );
};
