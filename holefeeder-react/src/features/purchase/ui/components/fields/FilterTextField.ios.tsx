import { HStack, Image, TextField, TextFieldRef } from '@expo/ui/swift-ui';
import { border, padding } from '@expo/ui/swift-ui/modifiers';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useStyles } from '@/shared/hooks/theme/use-styles';

type FilterTextFieldProps = {
  filter: string;
  setFilter: (filter: string) => void;
  onSubmit: () => void;
  placeholder: string;
};

const useComponentStyles = () =>
  useStyles((theme) => ({
    container: {
      width: '100%',
      flexDirection: 'column',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.separator,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
    },
    icon: {
      color: theme.colors.primary,
    },
  }));

export const FilterTextField = ({ filter, setFilter, onSubmit, placeholder }: FilterTextFieldProps) => {
  const styles = useComponentStyles();
  const textFieldRef = useRef<TextFieldRef>(null);

  useEffect(() => {
    const updateText = async () => {
      // Add a small delay to ensure view is mounted
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (textFieldRef.current) {
        await textFieldRef.current.setText(filter);
      }
    };

    updateText().then();
  }, [filter]);

  return (
    <HStack modifiers={[border({ width: 1, color: '#DADCE3' })]}>
      <TextField
        ref={textFieldRef}
        autocorrection={false}
        onChangeText={setFilter}
        placeholder={placeholder}
        modifiers={[padding({ all: 4 })]}
      />
      <Image systemName="plus" onPress={onSubmit} color={styles.icon.color} />
    </HStack>
  );
};
