import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

export type PickerOption = {
  id: string | number;
  [key: string]: any;
};

export type PickerProps<T extends PickerOption> = {
  variant?: 'menu' | 'segmented';
  options: T[];
  selectedOption: T;
  onSelectOption: (option: T) => void;
  onOptionLabel: (option: T) => string;
  style?: StyleProp<ViewStyle>;
};

const createStyles = (theme: Theme) => ({
  container: {
    position: 'relative' as const,
    width: '100%',
  },
  picker: {
    ...theme.styles.components.picker,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.separator,
  },
  pickerItem: {
    ...theme.styles.components.pickerItem,
    ...Platform.select({
      web: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      },
      default: {},
    }),
  },
});

export const AppPicker = <T extends PickerOption>({
  variant = 'menu',
  options,
  selectedOption,
  onSelectOption,
  onOptionLabel,
  style,
}: PickerProps<T>) => {
  const styles = useStyles(createStyles);

  if (!options) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <View style={[styles.container, style]}>
      <Picker
        style={styles.picker}
        selectedValue={selectedOption?.id}
        onValueChange={(itemValue: string | number) => {
          const selected = options.find((option) => option.id === itemValue);
          if (selected) {
            onSelectOption(selected);
          }
        }}
      >
        {options.map((option) => (
          <Picker.Item key={option.id} label={onOptionLabel(option)} value={option.id} style={styles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
};
