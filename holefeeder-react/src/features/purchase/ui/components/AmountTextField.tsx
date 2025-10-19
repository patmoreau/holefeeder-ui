import React, { useState } from 'react';
import { StyleProp, TextInput, TextStyle } from 'react-native';
import { useStyles, useTextStyles } from '@/hooks/theme/use-styles';
import { amountInputConverter } from '@/utils/amount-input-converter';

type Props = {
  initialAmount?: number;
  placeHolder?: string;
  style?: StyleProp<TextStyle>;
  onAmountChange: (amount: number) => void;
};

export function AmountTextField({ initialAmount = 0, placeHolder = '', style, onAmountChange }: Props) {
  const [displayValue, setDisplayValue] = useState(initialAmount > 0 ? initialAmount.toFixed(2) : '');

  const { body } = useTextStyles();

  const styles = useStyles(() => ({
    textInput: {
      ...body,
      textAlign: 'right',
    },
  }));

  // const textFieldRef = useRef<TextFieldRef>(null);
  // const updateDisplayValue = (newValue: string) => {
  //   setDisplayValue(newValue);
  //   if (textFieldRef.current) {
  //     textFieldRef.current.setText(newValue).then();
  //   }
  // };

  const handleChange = (text: string) => amountInputConverter(text, setDisplayValue, onAmountChange);

  return (
    <TextInput
      style={[styles.textInput, style]}
      value={displayValue}
      onChangeText={handleChange}
      keyboardType="numeric"
      placeholder={placeHolder}
      placeholderTextColor="#999"
    />
    // <VStack alignment="trailing">
    //   <TextField
    //     ref={textFieldRef}
    //     autocorrection={false}
    //     defaultValue={initialValue}
    //     placeholder={placeHolder}
    //     keyboardType={'numeric'}
    //     modifiers={[frame({ alignment: 'trailing' })]}
    //     onChangeText={handleChange}
    //   />
    // </VStack>
  );
}
