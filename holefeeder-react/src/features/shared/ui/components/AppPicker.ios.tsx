import { Host, Picker } from '@expo/ui/swift-ui';
import { fixedSize, frame, padding } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { PickerOption, PickerProps } from '@/features/shared/ui/components/AppPicker';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';

export const AppPicker = <T extends PickerOption>({
  variant = 'menu',
  options,
  onOptionLabel,
  selectedOption,
  onSelectOption,
  style,
}: PickerProps<T>) => {
  const [minWidth, setMinWidth] = useState<number | undefined>(undefined);

  if (!options) {
    return <LoadingIndicator size="small" />;
  }

  const fillSpace = StyleSheet.flatten(style)?.width === '100%';
  const paddingHorizontal = (StyleSheet.flatten(style)?.paddingHorizontal as number) || 0;
  const widthCorrection = paddingHorizontal * 2;

  if (fillSpace) {
    return (
      <Host
        matchContents
        onLayoutContent={(event) => {
          const { width } = event.nativeEvent;
          setMinWidth((currentWidth) => Math.max(currentWidth || 0, width - widthCorrection));
        }}
      >
        <Picker
          options={options.map((option) => onOptionLabel(option))}
          modifiers={[frame({ maxWidth: minWidth }), padding({ horizontal: paddingHorizontal })]}
          selectedIndex={options.findIndex((option) => option === selectedOption)}
          onOptionSelected={({ nativeEvent: { index } }) => onSelectOption(options[index])}
          variant={variant}
        />
      </Host>
    );
  }
  return (
    <Host {...(!style ? { matchContents: true } : {})} style={style}>
      <Picker
        options={options.map((option) => onOptionLabel(option))}
        modifiers={[fixedSize({ horizontal: true, vertical: true })]}
        selectedIndex={options.findIndex((option) => option === selectedOption)}
        onOptionSelected={({ nativeEvent: { index } }) => onSelectOption(options[index])}
        variant={variant}
      />
    </Host>
  );
};
