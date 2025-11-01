import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';

interface ButtonProps extends Omit<PressableProps, 'onPress'> {
  variant?: 'primary' | 'secondary' | 'destructive';
  onPress?: () => void;
}

const useButtonStyles = () =>
  useStyles((theme) => ({
    primaryButton: {
      ...theme.styles.buttons.primary,
      backgroundColor: theme.colors.primary,
    },
    destructiveButton: {
      ...theme.styles.buttons.destructive,
      backgroundColor: theme.colors.destructive,
    },
    secondaryButton: {
      ...theme.styles.buttons.secondary,
      backgroundColor: theme.colors.secondary,
    },
  }));
export function Button({ variant = 'secondary', onPress = () => {}, ...props }: ButtonProps) {
  const styles = useButtonStyles();

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'destructive':
        return styles.destructiveButton;
      case 'secondary':
      default:
        return styles.secondaryButton;
    }
  };
  return <Pressable style={getVariantStyle()} onPress={onPress} accessibilityRole="button" {...props} />;
}
