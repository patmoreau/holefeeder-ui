import { Host, HStack, Image, TextField, TextFieldRef } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { AppTextInputProps } from '@/features/shared/ui/components/AppTextInput';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppIcons } from '@/types/icons';

const useComponentStyles = () =>
  useStyles((theme) => ({
    container: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
      width: '100%',
      flexDirection: 'column',
    },
    input: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
    },
    icon: {
      color: theme.colors.primary,
    },
  }));

export const AppTextInput = ({ placeholder, value, onChangeText, icon, onSubmit }: AppTextInputProps) => {
  const styles = useComponentStyles();
  const textFieldRef = useRef<TextFieldRef>(null);

  useEffect(() => {
    const updateText = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (textFieldRef.current) {
        await textFieldRef.current.setText(value);
      }
    };

    updateText().then();
  }, [value]);

  return (
    <Host matchContents style={styles.container}>
      <HStack>
        <TextField
          ref={textFieldRef}
          autocorrection={false}
          onChangeText={onChangeText}
          placeholder={placeholder}
          modifiers={[padding({ all: 4 })]}
        />
        {icon && onSubmit && <Image systemName={AppIcons.add} onPress={onSubmit} color={styles.icon.color} />}
      </HStack>
    </Host>
  );
};
