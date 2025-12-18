import { Picker } from '@expo/ui/swift-ui';
import { fixedSize } from '@expo/ui/swift-ui/modifiers';
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
        options={options.map((option) => onOptionLabel(option))}
        modifiers={variant === 'menu' ? [fixedSize({ horizontal: true, vertical: true })] : []}
        selectedIndex={options.findIndex((option) => option === selectedOption)}
        onOptionSelected={({ nativeEvent: { index } }) => onSelectOption(options[index])}
        variant={variant}
      />
    </AppHost>
  );
};
