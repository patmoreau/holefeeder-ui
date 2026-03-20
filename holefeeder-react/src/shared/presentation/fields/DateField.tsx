import { DateOnly } from '@/shared/core/date-only';
import { AppField } from '@/shared/presentation/AppField';
import { AppDatePicker } from '@/shared/presentation/components/AppDatePicker';
import { AppIcons } from '@/types/icons';

type Props = {
  label: string;
  selectedDate: DateOnly | null;
  onDateSelected: (date: DateOnly) => void;
};

export function DateField({ label, selectedDate, onDateSelected }: Props) {
  return (
    <AppField label={label} icon={AppIcons.calendar}>
      <AppDatePicker selectedDate={selectedDate} onDateSelected={onDateSelected} />
    </AppField>
  );
}
