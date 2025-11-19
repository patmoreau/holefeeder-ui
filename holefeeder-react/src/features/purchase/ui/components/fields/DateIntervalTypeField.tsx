import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { Field } from '@/features/shared/ui/Field';
import { Picker, PickerOption } from '@/features/shared/ui/Picker';
import { tk } from '@/i18n/translations';

const tkTypes: Record<DateIntervalType, string> = {
  [DateIntervalType.weekly]: tk.dateIntervalTypePicker.weekly,
  [DateIntervalType.monthly]: tk.dateIntervalTypePicker.monthly,
  [DateIntervalType.yearly]: tk.dateIntervalTypePicker.yearly,
  [DateIntervalType.oneTime]: tk.dateIntervalTypePicker.oneTime,
};

type DateIntervalTypeOption = PickerOption & {
  value: DateIntervalType;
};

type Props = {
  selectedDateIntervalType: DateIntervalType | null;
  onSelectDateIntervalType: (dateIntervalType: DateIntervalType) => void;
};

export function DateIntervalTypeField({ selectedDateIntervalType, onSelectDateIntervalType }: Props) {
  const { t } = useTranslation();

  const options = useMemo<DateIntervalTypeOption[]>(() => {
    const types = Object.values(DateIntervalType) as DateIntervalType[];
    return types.map((type) => ({
      id: type,
      value: type,
    }));
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedDateIntervalType) ?? options[0];

  return (
    <Field label={t(tk.purchase.cashflowSection.intervalType)} iconSymbolName={'calendar'}>
      <Picker
        options={options}
        selectedOption={selectedOption}
        onSelectOption={(option) => onSelectDateIntervalType(option.value)}
        onOptionLabel={(option) => t(tkTypes[option.value])}
      />
    </Field>
  );
}
