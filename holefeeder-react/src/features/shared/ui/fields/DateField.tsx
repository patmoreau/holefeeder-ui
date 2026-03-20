import { AppField } from '@/features/shared/ui/AppField';
import { AppDatePicker } from '@/features/shared/ui/components/AppDatePicker';
import { DateOnly } from '@/shared/core/date-only';
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
