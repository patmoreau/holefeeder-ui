import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

type Props = {
  amount: number;
  onAmountChange: (amount: number) => void;
};

const createStyles = (theme: Theme) => ({
  container: {
    width: '100%' as const,
  },
  input: {
    color: theme.colors.text,
    fontSize: 48 as const,
    fontWeight: 600 as const,
    paddingVertical: 16 as const,
    textAlign: 'center' as const,
  },
});

const formatCurrency = (val: number, isEditing: boolean) => `${isEditing ? '' : '$'}${val.toFixed(2)}`;

export const AmountField = ({ amount, onAmountChange }: Props) => {
  const styles = useStyles(createStyles);

  const [displayAmount, setDisplayAmount] = useState<string>(formatCurrency(amount, false));
  const [enteringFocus, setEnteringFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end?: number } | undefined>(undefined);

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
      const formatted = formatCurrency(amount, false);
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
};
