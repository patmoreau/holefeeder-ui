import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppButtonVariant } from '@/features/shared/ui/components/AppButtonVariant';
import { ThemedText } from '@/features/shared/ui/components/ThemedText';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppIcons } from '@/types/icons';
import { Theme } from '@/types/theme/theme';

export type ButtonProps = Omit<PressableProps, 'onPress'> & {
  label?: string;
  icon?: AppIcons;
  variant?: AppButtonVariant;
  onPress?: () => void;
};

const createStyles = (theme: Theme) => ({
  primaryButton: {
    ...theme.styles.buttons.primary,
    color: theme.colors.primaryText,
    backgroundColor: theme.colors.primary,
  },
  destructiveButton: {
    ...theme.styles.buttons.destructive,
    color: theme.colors.primaryText,
    backgroundColor: theme.colors.destructive,
  },
  secondaryButton: {
    ...theme.styles.buttons.secondary,
    color: theme.colors.primaryText,
    backgroundColor: theme.colors.secondary,
  },
  linkButton: {
    ...theme.styles.buttons.link,
    color: theme.colors.link,
    backgroundColor: 'transparent',
  },
});

export function AppButton({ label, icon, variant = AppButtonVariant.secondary, onPress = () => {}, children, ...props }: ButtonProps) {
  const styles = useStyles(createStyles);

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'destructive':
        return styles.destructiveButton;
      case 'link':
        return styles.linkButton;
      case 'secondary':
      default:
        return styles.secondaryButton;
    }
  };

  const style = getVariantStyle();

  return (
    <Pressable style={style} onPress={onPress} accessibilityRole="button" {...props}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && <IconSymbol name={icon} color={style.color} />}
        {label && (
          <ThemedText style={{ color: style.color }} variant="default">
            {label}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}
