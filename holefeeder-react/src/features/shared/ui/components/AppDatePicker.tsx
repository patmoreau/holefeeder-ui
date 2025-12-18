import React from 'react';
import { StyleProp, TextInput, ViewStyle } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

export type DatePickerProps = {
  selectedDate: string | null;
  onDateSelected: (date: string) => void;
  style?: StyleProp<ViewStyle>;
};

const createStyles = (theme: Theme) => ({
  dateInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
    outline: 'none',
    padding: 8,
    minWidth: 120,
    textAlign: 'right' as const,
  },
});

export function AppDatePicker({ selectedDate, onDateSelected, style }: DatePickerProps) {
  const styles = useStyles(createStyles);

  const handleDateChange = (text: string) => {
    if (text) {
      onDateSelected(text);
    }
  };

  return (
    <TextInput
      style={[styles.dateInput, style]}
      value={selectedDate || ''}
      onChange={(e) => handleDateChange((e.target as unknown as HTMLInputElement).value)}
      placeholder="YYYY-MM-DD"
      {...({ type: 'date' } as any)}
    />
  );
}
