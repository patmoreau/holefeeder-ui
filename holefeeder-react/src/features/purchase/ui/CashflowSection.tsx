import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { DateField } from '@/features/purchase/ui/components/fields/DateField';
import { DateIntervalTypeField } from '@/features/purchase/ui/components/fields/DateIntervalTypeField';
import { FrequencyField } from '@/features/purchase/ui/components/fields/FrequencyField';
import { HasCashflowField } from '@/features/purchase/ui/components/fields/HasCashflowField';
import { AppSection } from '@/features/shared/ui/AppSection';
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
