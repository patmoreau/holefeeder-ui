import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '@/features/shared/ui/Field';
import { Picker, PickerOption } from '@/features/shared/ui/Picker';
import { tk } from '@/i18n/translations';

type FrequencyOption = PickerOption & {
  value: number;
};

type Props = {
  selectedFrequency: number | null;
  onSelectFrequency: (frequency: number) => void;
};

export function FrequencyField({ selectedFrequency, onSelectFrequency }: Props) {
  const { t } = useTranslation();

  const options = useMemo<FrequencyOption[]>(() => {
    const types = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return types.map((type) => ({
      id: type,
      value: type,
    }));
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedFrequency) ?? null;

  return (
    <Field label={t(tk.purchase.cashflowSection.frequency)} icon={'calendar'}>
      <Picker
        options={options}
        selectedOption={selectedOption}
        onSelectOption={(option) => onSelectFrequency(option.value)}
        onOptionLabel={(option) => option.value.toString()}
      />
    </Field>
  );
}
