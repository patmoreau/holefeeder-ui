import { AppField } from '@/features/shared/ui/AppField';
import { AppDatePicker } from '@/features/shared/ui/components/AppDatePicker';
import { AppIcons } from '@/types/icons';

type Props = {
  label: string;
  selectedDate: string | null;
  onDateSelected: (date: string) => void;
};

export function DateField({ label, selectedDate, onDateSelected }: Props) {
  return (
    <AppField label={label} icon={AppIcons.calendar}>
      <AppDatePicker selectedDate={selectedDate} onDateSelected={onDateSelected} />
    </AppField>
  );
}
