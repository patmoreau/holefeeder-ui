import { Picker as PickerRN } from '@react-native-picker/picker';
import React from 'react';
import { Platform, View } from 'react-native';
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
};

const createStyles = (theme: Theme) => ({
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

export const Picker = <T extends PickerOption>({
  variant = 'menu',
  options,
  selectedOption,
  onSelectOption,
  onOptionLabel,
}: PickerProps<T>) => {
  const styles = useStyles(createStyles);

  if (!options) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <PickerRN
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
          <PickerRN.Item key={option.id} label={onOptionLabel(option)} value={option.id} style={styles.pickerItem} />
        ))}
      </PickerRN>
    </View>
  );
};
