import { DateTimePicker } from '@expo/ui/swift-ui';

type Props = {
  selectedDate: string | null;
  onDateSelected: (date: string) => void;
};

export function DatePicker({ selectedDate, onDateSelected }: Props) {
  const initialDate = selectedDate
    ? new Date(Number(selectedDate.slice(0, 4)), Number(selectedDate.slice(5, 7)) - 1, Number(selectedDate.slice(8, 10)))
    : new Date();
  const datePickerProps = {
    onDateSelected: (date: Date) =>
      onDateSelected(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`),
    displayedComponents: 'date' as const,
    variant: 'compact' as const,
    ...(selectedDate && { initialDate: initialDate.toISOString() }),
  };

  return <DateTimePicker {...datePickerProps} />;
}
