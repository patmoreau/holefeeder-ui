import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';
import { formatCurrency } from '@/utils/format-currency';

type Props = {
  amount: number;
  onAmountChange: (amount: number) => void;
};

export type AmountFieldRef = {
  focus: () => void;
};

const createStyles = (theme: Theme) => ({
  container: {
    width: '100%' as const,
  },
  input: {
    color: theme.colors.secondary,
    fontSize: 48 as const,
    fontWeight: 600 as const,
    paddingVertical: 16 as const,
    textAlign: 'center' as const,
  },
});

export const AmountField = React.forwardRef<AmountFieldRef, Props>(({ amount, onAmountChange }, ref) => {
  const styles = useStyles(createStyles);
  const inputRef = useRef<TextInput>(null);

  const [displayAmount, setDisplayAmount] = useState<string>(formatCurrency(amount));
  const [enteringFocus, setEnteringFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end?: number } | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (enteringFocus) {
      requestAnimationFrame(() => {
        setSelection({ start: 0, end: displayAmount.length });
        setEnteringFocus(false);
      });
    }
  }, [enteringFocus, displayAmount.length]);

  useEffect(() => {
    if (!isEditing) {
      const formatted = formatCurrency(amount);
      if (formatted !== displayAmount) {
        setDisplayAmount(formatted);
      }
    }
  }, [amount, isEditing, displayAmount]);

  const handleChangeText = (text: string) => {
    const digits = text.replace(/\D/g, '');

    const amount = digits ? parseInt(digits, 10) / 100 : 0;

    setSelection(undefined);

    setDisplayAmount(formatCurrency(amount, true));

    onAmountChange(amount);
  };

  const handleFocus = () => {
    setIsEditing(true);
    const newDisplayAmount = formatCurrency(amount, true);
    setDisplayAmount(newDisplayAmount);

    requestAnimationFrame(() => {
      setEnteringFocus(true);
    });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <View style={[styles.container]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={displayAmount}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selection={selection}
        keyboardType="numeric"
      />
    </View>
  );
});

AmountField.displayName = 'AmountField';
