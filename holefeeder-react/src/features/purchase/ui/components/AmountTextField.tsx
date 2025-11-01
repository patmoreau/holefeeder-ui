import { TextField, TextFieldRef, VStack } from '@expo/ui/swift-ui';
import React, { useRef, useState } from 'react';
import { amountInputConverter } from '@/utils/amount-input-converter';

type Props = {
  initialAmount?: number;
  placeHolder?: string;
  onAmountChange: (amount: number) => void;
};

export function AmountTextField({ initialAmount = 0, placeHolder = '', onAmountChange }: Props) {
  const [displayValue, setDisplayValue] = useState(initialAmount > 0 ? initialAmount.toFixed(2) : '');

  const textFieldRef = useRef<TextFieldRef>(null);
  const updateDisplayValue = (newValue: string) => {
    setDisplayValue(newValue);
    if (textFieldRef.current) {
      textFieldRef.current.setText(newValue).then();
    }
  };

  const handleChange = (text: string) => amountInputConverter(text, updateDisplayValue, onAmountChange);

  return (
    <VStack alignment="trailing">
      <TextField
        ref={textFieldRef}
        autocorrection={false}
        defaultValue={displayValue}
        placeholder={placeHolder}
        keyboardType={'numeric'}
        modifiers={[]}
        onChangeText={handleChange}
      />
    </VStack>
  );
}
