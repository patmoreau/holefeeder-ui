import { Picker, Text } from '@expo/ui/swift-ui';
import { fixedSize, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { PickerOption, PickerProps } from '@/features/shared/ui/components/AppPicker';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';

export const AppPicker = <T extends PickerOption>({
  variant = 'menu',
  options,
  onOptionLabel,
  selectedOption,
  onSelectOption,
}: PickerProps<T>) => {
  if (!options) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <AppHost>
      <Picker
        modifiers={[pickerStyle(variant), ...(variant === 'menu' ? [fixedSize({ horizontal: true, vertical: true })] : [])]}
        selection={selectedOption.id}
        onSelectionChange={(id) => {
          const selected = options.find((option) => option.id === id);
          if (selected) onSelectOption(selected);
        }}
      >
        {options.map((option) => (
          <Text key={option.id} modifiers={[tag(option.id)]}>
            {onOptionLabel(option)}
          </Text>
        ))}
      </Picker>
    </AppHost>
  );
};
