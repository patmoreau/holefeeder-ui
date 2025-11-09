import { LabeledContent, Picker, Section, Switch } from '@expo/ui/swift-ui';
import React from 'react';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { DateIntervalTypePicker } from '@/features/purchase/ui/components/DateIntervalTypePicker';
import { DatePicker } from '@/features/purchase/ui/components/DatePicker';
import { useLanguage } from '@/shared/hooks/use-language';

export const CashflowSection = () => {
  const { t } = useLanguage();
  const { formData, updateFormField } = usePurchaseForm();

  return (
    <Section title={t('purchase.cashflowSection.title')}>
      <LabeledContent label={t('purchase.cashflowSection.cashflow')}>
        <Switch value={formData.hasCashflow} onValueChange={(value) => updateFormField('hasCashflow', value)} />
      </LabeledContent>
      {formData.hasCashflow && (
        <>
          <LabeledContent label={t('purchase.cashflowSection.date')}>
            <DatePicker
              selectedDate={formData.cashflowEffectiveDate}
              onDateSelected={(date) => updateFormField('cashflowEffectiveDate', date)}
            />
          </LabeledContent>
          <LabeledContent label={t('purchase.cashflowSection.intervalType')}>
            <DateIntervalTypePicker
              selectedDateIntervalType={formData.cashflowIntervalType}
              onSelectDateIntervalType={(type) => updateFormField('cashflowIntervalType', type)}
            />
          </LabeledContent>
          <LabeledContent label={t('purchase.cashflowSection.frequency')}>
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
