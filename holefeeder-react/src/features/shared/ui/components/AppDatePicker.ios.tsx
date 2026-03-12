import { DatePicker, DatePickerProps } from '@expo/ui/swift-ui';
import { StyleProp, ViewStyle } from 'react-native';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { withDate } from '@/features/shared/utils/with-date';
import { DateOnly } from '@/domain/core/date-only';

export type AppDatePickerProps = {
  selectedDate: DateOnly | null;
  onDateSelected: (date: DateOnly) => void;
  style?: StyleProp<ViewStyle>;
};

export const AppDatePicker = ({ selectedDate, onDateSelected }: AppDatePickerProps) => {
  const initialDate = withDate(selectedDate || new Date()).toDate();

  const datePickerProps: DatePickerProps = {
    onDateChange: (date: Date) => onDateSelected(withDate(date).toDateOnly()),
    displayedComponents: ['date' as const],
    selection: initialDate,
  };

  return (
    <AppHost>
      <DatePicker {...datePickerProps} />
    </AppHost>
  );
};
