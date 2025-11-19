import { Host, Picker as PickerIos, Text } from '@expo/ui/swift-ui';
import { allowsTightening, frame, pickerStyle, tag, truncationMode } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { View } from 'react-native';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { PickerOption, PickerProps } from '@/features/shared/ui/Picker';

export const Picker = <T extends PickerOption>({
  variant = 'menu',
  options,
  onOptionLabel,
  selectedOption,
  onSelectOption,
}: PickerProps<T>) => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  if (!options) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <View
      style={{ width: '100%', alignItems: 'flex-end' }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setWidth((currentMinWidth) => Math.max(currentMinWidth || 0, width));
      }}
    >
      <Host matchContents>
        <PickerIos
          modifiers={[pickerStyle(variant), frame({ minWidth: width, alignment: 'trailing' })]}
          selection={options.findIndex((option) => option === selectedOption)}
          onSelectionChange={({ nativeEvent: { selection } }) => onSelectOption(options[selection as number])}
        >
          {options.map((option, index) => (
            <Text key={index} lineLimit={1} modifiers={[tag(index), allowsTightening(true), truncationMode('tail')]}>
              {onOptionLabel(option)}
            </Text>
          ))}
        </PickerIos>
      </Host>
    </View>
  );
};
