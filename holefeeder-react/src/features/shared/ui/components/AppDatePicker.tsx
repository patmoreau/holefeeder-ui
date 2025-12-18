import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export function AppDatePicker({ selectedDate, onDateSelected, style }: DatePickerProps) {
  const defaultStyles = useDefaultStyles();
  const styles = useStyles(createStyles);
  const [selected, setSelected] = useState<DateType>(selectedDate);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setSelected(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (params: { date: DateType }) => {
    const date = params.date;
    setSelected(date);
    if (date) {
      let dateString = '';
      if (typeof date === 'string') {
        dateString = date;
      } else if (typeof date === 'number') {
        dateString = new Date(date).toISOString();
      } else if (typeof date === 'object') {
        if ('toISOString' in date && typeof (date as any).toISOString === 'function') {
          dateString = (date as any).toISOString();
        } else if (date instanceof Date) {
          dateString = date.toISOString();
        }
      }

      if (dateString) {
        onDateSelected(dateString.slice(0, 10));
      }
      setShowPicker(false);
    }
  };

  const displayDate = selectedDate
    ? new Date(Number(selectedDate.slice(0, 4)), Number(selectedDate.slice(5, 7)) - 1, Number(selectedDate.slice(8, 10))).toLocaleDateString(
        'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      )
    : 'Select Date';

  return (
    <>
      <Pressable onPress={() => setShowPicker(true)} style={style}>
        <Text style={styles.dateInput}>{displayDate}</Text>
      </Pressable>
      <Modal animationType="fade" transparent={true} visible={showPicker} onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <DateTimePicker mode="single" date={selected} onChange={handleDateChange} styles={defaultStyles} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
