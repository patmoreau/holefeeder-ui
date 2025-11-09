import { LabeledContent, Picker, Section, Switch } from '@expo/ui/swift-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { DateIntervalTypePicker } from '@/features/purchase/ui/components/DateIntervalTypePicker';
import { DatePicker } from '@/features/purchase/ui/components/DatePicker';
import { tk } from '@/i18n/translations';

export const CashflowSection = () => {
  const { t } = useTranslation();
  const { formData, updateFormField } = usePurchaseForm();

  return (
    <Section title={t(tk.purchase.cashflowSection.title)}>
      <LabeledContent label={t(tk.purchase.cashflowSection.cashflow)}>
        <Switch value={formData.hasCashflow} onValueChange={(value) => updateFormField('hasCashflow', value)} />
      </LabeledContent>
      {formData.hasCashflow && (
        <>
          <LabeledContent label={t(tk.purchase.cashflowSection.date)}>
            <DatePicker
              selectedDate={formData.cashflowEffectiveDate}
              onDateSelected={(date) => updateFormField('cashflowEffectiveDate', date)}
            />
          </LabeledContent>
          <LabeledContent label={t(tk.purchase.cashflowSection.intervalType)}>
            <DateIntervalTypePicker
              selectedDateIntervalType={formData.cashflowIntervalType}
              onSelectDateIntervalType={(type) => updateFormField('cashflowIntervalType', type)}
            />
          </LabeledContent>
          <LabeledContent label={t(tk.purchase.cashflowSection.frequency)}>
            <Picker
              options={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
              selectedIndex={formData.cashflowFrequency - 1}
              onOptionSelected={({ nativeEvent: { index } }) => {
                updateFormField('cashflowFrequency', index + 1);
              }}
              variant="menu"
            />
          </LabeledContent>
        </>
      )}
    </Section>
  );
};
