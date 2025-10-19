import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { useViewStyles } from '@/hooks/theme/use-styles';

interface ButtonProps extends Omit<PressableProps, 'onPress'> {
  variant?: 'primary' | 'secondary' | 'destructive';
  onPress?: () => void;
}
export function Button({ variant = 'secondary', onPress = () => {}, ...props }: ButtonProps) {
  const viewStyles = useViewStyles();

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return viewStyles.primaryButton;
      case 'destructive':
        return viewStyles.destructiveButton;
      case 'secondary':
      default:
        return viewStyles.secondaryButton;
    }
  };
  return <Pressable style={getVariantStyle()} onPress={onPress} {...props} />;
}
