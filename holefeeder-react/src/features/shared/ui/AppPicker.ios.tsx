import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { allowsTightening, fixedSize, frame, padding, pickerStyle, tag, truncationMode } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { PickerOption, PickerProps } from '@/features/shared/ui/AppPicker';
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
          modifiers={[pickerStyle(variant), frame({ maxWidth: minWidth }), padding({ horizontal: paddingHorizontal })]}
          selection={options.findIndex((option) => option === selectedOption)}
          onSelectionChange={({ nativeEvent: { selection } }) => onSelectOption(options[selection as number])}
        >
          {options.map((option, index) => (
            <Text key={index} lineLimit={1} modifiers={[tag(index), allowsTightening(true), truncationMode('tail')]}>
              {onOptionLabel(option)}
            </Text>
          ))}
        </Picker>
      </Host>
    );
  }
  return (
    <Host {...(!style ? { matchContents: true } : {})} style={style}>
      <Picker
        modifiers={[pickerStyle(variant), fixedSize({ horizontal: true, vertical: true })]}
        selection={options.findIndex((option) => option === selectedOption)}
        onSelectionChange={({ nativeEvent: { selection } }) => onSelectOption(options[selection as number])}
      >
        {options.map((option, index) => (
          <Text key={index} lineLimit={1} modifiers={[tag(index), allowsTightening(true), truncationMode('tail')]}>
            {onOptionLabel(option)}
          </Text>
        ))}
      </Picker>
    </Host>
  );
};
